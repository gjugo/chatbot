import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { ChatOpenAI } from '@langchain/openai';
import { START, END, MessagesAnnotation, StateGraph, MemorySaver } from '@langchain/langgraph';
import { v4 as uuidv4 } from "uuid";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Define llm using ChatOpenAI
const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0
});

// Define the prompt template
const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful AI assistant focused on providing accurate and concise responses. Your responses should be clear, informative, and direct.",
  ],
  ["placeholder", "{messages}"],
]);

// Define the function that calls the model
const callModel = async (state) => {
  const prompt = await promptTemplate.invoke({ messages: state.messages });
  const response = await llm.invoke(prompt);
  return { messages: [response] };
};

// Create a new StateGraph workflow
const workflow = new StateGraph(MessagesAnnotation)
  .addNode('model', callModel)
  .addEdge(START, 'model')
  .addEdge('model', END);

// Set up memory saver for message persistence
const memory = new MemorySaver();

// Compile workflow into an executable app
const appWorkflow = workflow.compile({ checkpointer: memory });

// Initialize Express server
const app = express();

// Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Vue dev server default port
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(bodyParser.json());

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const threadId = req.body.thread_id;
    
    if (!userMessage) {
      return res.status(400).json({ error: 'No message provided' });
    }

    const config = { configurable: { thread_id: threadId || uuidv4() } };
    
    // Prepare the initial state with user message
    const state = {
      messages: [{ role: 'user', content: userMessage }]
    };

    // Run the workflow
    const result = await appWorkflow.invoke(state, config);
    
    // Extract and format the AI's response
    // Log the result to debug
    console.log('LangChain response:', JSON.stringify(result, null, 2));
    
    const aiMessage = result.messages[result.messages.length - 1]; // Get the last message
    const formattedResponse = {
      messages: [{
        text: aiMessage.content, // Access content directly from the message
        isUser: false
      }]
    };

    // Return the formatted response
    res.json(formattedResponse);
  } catch (error) {
    console.error('Error in /chat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
