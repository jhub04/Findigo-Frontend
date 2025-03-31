<script setup lang="ts">
import { fetchAllUserMessages } from '@/services/messageApi';
import { useCurrentUser } from '@/utils/useCurrentUser.ts';
import type { MessageResponse } from '@/types/dto';
import { ref, onMounted } from 'vue';

const { user } = useCurrentUser();
const messages = ref<MessageResponse[]>([]);
const loading = ref(false);
const error = ref('');


onMounted(async () => {
  if (!user.value) return;

  loading.value = true;
  try {
    messages.value = await fetchAllUserMessages(user.value.id);
  } catch (err) {
    error.value = 'Error fetching messages.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

</script>

<template>
    <div class="inbox-container">
      <h1>Your Messages</h1>
  
      <p v-if="loading">Loading messages...</p>
      <p v-if="error" class="error-message">{{ error }}</p>
  
      <ul v-if="!loading && messages.length">
        <li v-for="message in messages" :key="message.messageId" class="message-card">
          <div class="message-header">
            <span class="participants">
              From: {{ message.fromUsername }} → To: {{ message.toUsername }}
            </span>
            <span class="timestamp">{{ formatDate(message.sentAt) }}</span>
          </div>
          <div class="message-body">
            {{ message.messageText }}
          </div>
        </li>
      </ul>
  
      <p v-if="!loading && messages.length === 0">You have no messages.</p>
    </div>
  </template>

<style scoped>
.inbox-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

.message-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.message-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 8px;
  color: #555;
}

.message-body {
  color: #444;
  font-size: 16px;
}

.timestamp {
  font-size: 13px;
  color: #888;
}

.error-message {
  color: red;
}
</style>