<script setup lang="ts">
import { fetchMessageThread } from '@/services/messageApi';
import { useCurrentUser } from '@/utils/useCurrentUser';
import type { MessageResponse } from '@/types/dto';
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const otherUserId = Number(route.params.userId);

const { user, isLoading: userLoading, error: userError } = useCurrentUser();
const messages = ref<MessageResponse[]>([]);
const loading = ref(false);
const error = ref('');

// Fetch messages when user is available
watch(user, async (newUser) => {
  if (!newUser) return;

  loading.value = true;
  try {
    messages.value = await fetchMessageThread(newUser.id, otherUserId);
  } catch (e) {
    error.value = 'Failed to fetch conversation.';
    console.error(e);
  } finally {
    loading.value = false;
  }
}, { immediate: true });

const formatDate = (iso: string) => new Date(iso).toLocaleString();

// Computed reversed messages for correct chronological order
const sortedMessages = computed(() => [...messages.value].sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()));

// Retrieve other user's username from messages
const otherUsername = computed(() => {
  const otherUserMessage = messages.value.find(msg => msg.fromUserId !== user.value!.id);
  return otherUserMessage ? (otherUserMessage.fromUserId === otherUserId ? otherUserMessage.fromUsername : otherUserMessage.toUsername) : 'Other user';
});
</script>

<template>
  <div class="thread-container">
    <h1>Conversation with {{ otherUsername }}</h1>

    <p v-if="userLoading || loading">Loading conversation...</p>
    <p v-if="userError" class="error">Failed to load user data.</p>
    <p v-if="error" class="error">{{ error }}</p>

    <ul v-if="!loading && sortedMessages.length">
      <li
        v-for="msg in sortedMessages"
        :key="msg.messageId"
        class="message"
        :class="{ 'other-user': msg.fromUserId !== user!.id }"
      >
        <div class="message-header">
          <strong>{{ msg.fromUserId === user!.id ? 'You' : otherUsername }}</strong>
          <span class="timestamp">{{ formatDate(msg.sentAt) }}</span>
        </div>
        <p>{{ msg.messageText }}</p>
      </li>
    </ul>

    <p v-if="!loading && !sortedMessages.length">No messages in this conversation.</p>
  </div>
</template>

<style scoped>
.thread-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.message {
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  background-color: #f7f7f7;
  transition: transform 0.2s ease;
}

.message.other-user {
  margin-left: 40px;
  background-color: #e3f2fd;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.timestamp {
  color: #999;
  font-size: 0.85em;
}

.error {
  color: red;
}
</style>
