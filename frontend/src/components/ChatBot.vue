<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  text: string
  isUser: boolean
  isPdf?: boolean
  fileName?: string
}

const messages = ref<Message[]>([
  { text: 'Hello! How can I help you today?', isUser: false }
])
const newMessage = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const sendMessage = () => {
  if (newMessage.value.trim()) {
    // Add user message
    messages.value.push({
      text: newMessage.value,
      isUser: true
    })
    
    // Simulate bot response
    setTimeout(() => {
      messages.value.push({
        text: `I received your message: "${newMessage.value}"`,
        isUser: false
      })
    }, 1000)
    
    newMessage.value = ''
  }
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    
    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      messages.value.push({
        text: 'Please upload only PDF files.',
        isUser: false
      })
      return
    }

    // Add file upload message
    messages.value.push({
      text: `Uploaded PDF: ${file.name}`,
      isUser: true,
      isPdf: true,
      fileName: file.name
    })

    // Simulate bot response
    setTimeout(() => {
      messages.value.push({
        text: `I received your PDF file: ${file.name}`,
        isUser: false
      })
    }, 1000)

    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const triggerFileUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}
</script>

<template>
  <div class="chat-container">
    <div class="messages">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.isUser ? 'user' : 'bot']"
      >
        <template v-if="message.isPdf">
          <div class="pdf-message">
            <svg class="pdf-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12 16H8V8h4a4 4 0 0 1 0 8zm-2-6v4h2a2 2 0 0 0 0-4h-2zm10-4v16H4V6h16zm2-2H2v20h20V4z"/>
            </svg>
            {{ message.text }}
          </div>
        </template>
        <template v-else>
          {{ message.text }}
        </template>
      </div>
    </div>
    <div class="input-area">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type your message..."
        type="text"
      />
      <input
        ref="fileInput"
        type="file"
        accept=".pdf"
        class="hidden-input"
        @change="handleFileUpload"
      />
      <button class="upload-btn" @click="triggerFileUpload" title="Upload PDF">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12 16l-4-4h3V4h2v8h3l-4 4zm9-13v18H3V3h18zm-2 2H5v14h14V5z"/>
        </svg>
      </button>
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  height: 80vh;
  display: flex;
  flex-direction: column;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
}

.message {
  margin: 10px;
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 70%;
  word-wrap: break-word;
}

.bot {
  background: #e3f2fd;
  align-self: flex-start;
  margin-right: auto;
}

.user {
  background: #e8f5e9;
  align-self: flex-end;
  margin-left: auto;
}

.input-area {
  display: flex;
  gap: 10px;
}

input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.hidden-input {
  display: none;
}

button {
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

button:hover {
  background: #45a049;
}

.upload-btn {
  background: #2196f3;
  padding: 10px;
}

.upload-btn:hover {
  background: #1976d2;
}

.pdf-message {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pdf-icon {
  flex-shrink: 0;
}
</style>