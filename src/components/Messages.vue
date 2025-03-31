<script setup lang="ts">
import { fetchAllUserMessages } from '@/services/messageApi';
import { useCurrentUser } from '@/utils/useCurrentUser.ts';
import type { MessageResponse } from '@/types/dto';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const { user, isLoading: userLoading, error: userError } = useCurrentUser();
const messages = ref<MessageResponse[]>([]);
const messagesLoading = ref(false);
const messagesError = ref('');

watch(user, async (newUser) => {
  if (!newUser) return;

  messagesLoading.value = true;
  try {
    messages.value = await fetchAllUserMessages(newUser.id);
  } catch (e) {
    messagesError.value = 'Failed to fetch messages.';
    console.error(e);
  } finally {
    messagesLoading.value = false;
  }
}, { immediate: true });

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

const getOtherUsername = (message: MessageResponse): string => {
  return message.fromUserId === user.value!.id
    ? message.toUsername
    : message.fromUsername;
};

const getOtherUserId = (message: MessageResponse): number => {
  return message.fromUserId === user.value!.id
    ? message.toUserId
    : message.fromUserId;
};

const router = useRouter();

const openMessageThread = (message: MessageResponse) => {
  const otherUserId = getOtherUserId(message);
  router.push({ name: 'MessageThread', params: { userId: otherUserId } });
};
</script>

<template>
  <div class="inbox-container">
    <h1>Your Messages</h1>

    <p v-if="userLoading || messagesLoading">Loading messages...</p>
    <p v-if="userError" class="error-message">Failed to load user data.</p>
    <p v-if="messagesError" class="error-message">{{ messagesError }}</p>

    <div v-if="!messagesLoading && messages.length">
      <div
        v-for="message in messages"
        :key="message.messageId"
        class="message-preview"
        :class="{ 'unread-message': !message.isRead && message.toUserId === user!.id }"
        @click="openMessageThread(message)"
      >
        <div class="message-header">
          <span class="participants">
            {{ getOtherUsername(message) }}
          </span>
          <span class="timestamp">{{ formatDate(message.sentAt) }}</span>
        </div>
        <div class="message-body">
          {{ message.messageText }}
        </div>
      </div>
    </div>

    <p v-if="!messagesLoading && messages.length === 0">You have no messages.</p>
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

.message-preview {
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.message-preview:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.unread-message {
  background-color: #e3f2fd;
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

/* Remove default styles for links */
a, a:hover, a:focus, a:active {
  text-decoration: none;
  color: inherit;
  outline: none;
}
</style>