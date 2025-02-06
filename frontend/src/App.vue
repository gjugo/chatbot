<script setup lang="ts">
import ChatBot from './components/ChatBot.vue'
</script>

<template>
  <div class="app-container">
    <h1>Simple Chatbot</h1>
    <ChatBot />
  </div>
</template>

<style>
.app-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}
</style>