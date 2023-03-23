import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  prompt: String,
  response: String,
  parentMessageId: String,
  role: String,
  messageId: String,
  created: Number,
  model: String,
  promptTokens: Number,
  completionTokens: Number,
  totalTokens: Number,
  audioName: String,
  audioData: Buffer,
  choices: [
    {
      text: String,
      index: Number,
      logprobs: Object,
      finishReason: String
    }
  ],
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
