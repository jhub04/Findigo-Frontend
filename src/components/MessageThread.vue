<script setup lang="ts">
import { fetchMessageThread } from '@/services/messageApi';
import { useCurrentUser } from '@/utils/useCurrentUser';
import type { MessageResponse } from '@/types/dto';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const otherUserId = Number(route.params.userId);

const { user } = useCurrentUser();
const messages = ref<MessageResponse[]>([]);
const loading = ref(false);
const error = ref('');

onMounted(async () => {
  if (!user.value) return;

  loading.value = true;
  try {
    messages.value = await fetchMessageThread(user.value.id, otherUserId);
  } catch (e) {
    error.value = 'Failed to fetch conversation.';
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const formatDate = (iso: string) => new Date(iso).toLocaleString();
</script>

<template>
  <div class="thread-container">
    <h1>Conversation</h1>

    <p v-if="loading">Loading conversation...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <ul v-if="!loading && messages.length">
      <li v-for="msg in messages" :key="msg.messageId" class="message">
        <strong>
          {{ msg.fromUserId === user!.id ? 'You' : 'Them' }}
        </strong>
        <span class="timestamp">{{ formatDate(msg.sentAt) }}</span>
        <p>{{ msg.messageText }}</p>
      </li>
    </ul>

    <p v-if="!loading && !messages.length">No messages in this conversation.</p>
  </div>
</template>

<style scoped>
.thread-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.message {
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
}

.timestamp {
  color: #999;
  font-size: 0.85em;
  float: right;
}

.error {
  color: red;
}
</style>
