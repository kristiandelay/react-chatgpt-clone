import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ChatGPTAPI } from "chatgpt";
import mongoose from "mongoose";
import Conversation from "./models/conversationModel.js";
import Chat from "./models/chatModel.js";

const app = express();
const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
  debug: true,
});

// enable CORS
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/chatgpt", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// API route for handling questions and generating responses
app.post("/api/chatgpt/question", async (req, res) => {
  const prompt = req.body.prompt;
  const parentMessageId = req.body.parentMessageId;

  try {
    const response = await api.sendMessage(prompt, { parentMessageId });
    console.log("response: ", response);

    const text = response.text ? response.text.substring(0, 25) : "";
    const trimmedText = text.length === 25 ? `${text}...` : text;

    let chatId = req.body.chatId;

    let chat = await Chat.findById(chatId);
    if (!chat) {
      // create a new chat without a reference to a conversation
      chat = new Chat({ title: trimmedText });
      await chat.save();
      chatId = chat._id;
    }

    res.send({
      message_id: response.id,
      text: response.text,
      parentMessageId,
      chatId,
    });

    // Save the conversation to MongoDB and associate it with the chat
    const conversation = new Conversation({
      chat: chat._id,
      prompt,
      response: response.text,
      parentMessageId,
      role: response.role,
      messageId: response.id,
      created: response.detail.created,
      model: response.detail.model,
      promptTokens: response.detail.usage.prompt_tokens,
      completionTokens: response.detail.usage.completion_tokens,
      totalTokens: response.detail.usage.total_tokens,
      choices: response.detail.choices.map((choice) => {
        return {
          text: choice.text,
          index: choice.index,
          logprobs: choice.logprobs,
          finishReason: choice.finish_reason,
        };
      }),
    });
    await conversation.save();
    console.log("conversation: ", conversation);
    console.log("Conversation saved to MongoDB");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/chatgpt/:id/messages", async (req, res) => {
  const chatId = req.params.id;

  try {
    const conversations = await Conversation.find({ chat: chatId });
    const messages = conversations.map((conversation) => {
      console.log("conversation: ", conversation);
      return {
        messageId: conversation.messageId,
        prompt: conversation.prompt,
        response: conversation.response,
        parentMessageId: conversation.parentMessageId,
      };
    });

    res.send(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/chatgpt/history", async (req, res) => {
  try {
    const chats = await Chat.find({}).sort({ createdAt: -1 });
    
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
