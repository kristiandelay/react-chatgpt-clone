import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ChatGPTAPI } from "chatgpt";
import mongoose from "mongoose";
import retry from 'retry';
import Conversation from "./models/conversationModel.js";
import Chat from "./models/chatModel.js";

import textToSpeech from "@google-cloud/text-to-speech";
// import fs from 'fs';
import fs from 'fs/promises';
import util from 'util';

import gTTS from 'gtts';
import md5 from "md5";

// const AWS = require('aws-sdk');

// AWS.config.update({
//   accessKeyId: 'your_access_key_id',
//   secretAccessKey: 'your_secret_access_key',
//   region: 'your_aws_region', // e.g. 'us-west-2'
// });

// const s3 = new AWS.S3();


// async function processMP3File() {
//   try {
//     const data = await fs.readFile('./b6e4568bbbd4159a0f312cfb43eaf713.mp3');
//   } catch (err) {
//     console.error('Error:', err);
//   }
// }

const uploadToS3 = async (url, key) => {
  const audioResponse = await axios.get(url, { responseType: 'arraybuffer' });
  const audioBuffer = Buffer.from(audioResponse.data, 'binary');

  const params = {
    Bucket: 'your_bucket_name',
    Key: key,
    Body: audioBuffer,
    ContentType: 'audio/wav',
  };

  await s3.upload(params).promise();
};

// processMP3File();


// Creates a client
const client = new textToSpeech.TextToSpeechClient();
 

const app = express();
const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
  // completionParams: { model: 'gpt-4' },
  debug: true,
});

// enable CORS
app.use(cors());
app.use(bodyParser.json());


// Define the MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Function that attempts to connect to MongoDB and retries if it fails
function connectWithRetry() {
  const operation = retry.operation();
  operation.attempt(() => {
    mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/chatgpt", mongoOptions)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        if (operation.retry(err)) {
          console.log(`Retrying MongoDB connection in ${operation._timeouts[operation._attempts-1]} ms`);
          return;
        }
        console.error("MongoDB connection error:", err);
      });
  });
}

// Call the function to connect to MongoDB with retry logic
connectWithRetry();

async function textToAudio(text = "hello world") {
  const trimmedText = text ? text.substring(0, 10) : "";

  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(`${trimmedText}.mp3`, response.audioContent, 'binary');
  console.log(`Audio content written to file: ${trimmedText}.mp3`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

    // await textToAudio(response.text);
    var speech = response.text;
    var gtts = new gTTS(speech, 'en');

    var fileName = response.text ? response.text.substring(0, 8) : "";
    const hash = md5(fileName);
    fileName = "generated_voice/" + hash + '.mp3';

    var fileResponse = await gtts.save(fileName);

    await sleep(20000); // Sleep for 20 seconds

    console.log('Text to speech converted!');
    console.log('fileResponse: ', fileResponse);

    // const buffer = await fs.readFile(fileName);
    res.type('application/json');
    res.json({
      message_id: response.id,
      text: response.text,
      parentMessageId,
      audioName: fileName,
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
      audioName: fileName,
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

app.post('/uberduck', async (req, res) => {
  try {
    const { speech, voice } = req.body;
    const uuid = await uberduckRequest(speech, voice);

    let status = await uberduckPoll(uuid);
    while (!status.finished_at) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      status = await uberduckPoll(uuid);
    }

    if (status.failed_at) {
      res.status(500).json({ error: 'Failed to generate audio.' });
    } else {
      const audioURL = status.path;
      const s3Key = `${uuid}.wav`; // You can customize the S3 object key as needed
      await uploadToS3(audioURL, s3Key);
      res.json({ s3Key });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
