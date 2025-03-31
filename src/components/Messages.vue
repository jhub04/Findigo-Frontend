<script setup lang="ts">
import { fetchAllUserMessages } from '@/services/messageApi'
import { useCurrentUser } from '@/utils/useCurrentUser.ts'
import type { MessageResponse } from '@/types/dto'
import { ref, onMounted } from 'vue'

const { user } = useCurrentUser()
const messages = ref<MessageResponse[]>([])
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  if (!user.value) return

  loading.value = true
  try {
    messages.value = await fetchAllUserMessages(user.value.id)
  } catch (e) {
    error.value = 'Failed to fetch messages'
    console.error(e)
  } finally {
    loading.value = false
  }
})

const formatDate = (iso: string) => new Date(iso).toLocaleString()

const getOtherUsername = (message: MessageResponse): string => {
  return message.fromUserId === user.value!.id ? message.toUsername : message.fromUsername
}

const getOtherUserId = (message: MessageResponse): number => {
  return message.fromUserId === user.value!.id
    ? message.toUserId
    : message.fromUserId;
};
</script>

<template>
  <div class="inbox-container">
    <h1>Your Inbox</h1>

    <p v-if="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <ul v-if="!loading && messages.length">
      <li v-for="msg in messages" :key="msg.messageId">
        <router-link :to="{ name: 'MessageThread', params: { userId: getOtherUserId(msg) } }">
          <div class="message-preview">
            <strong>{{ getOtherUsername(msg) }}</strong>
            <p>{{ msg.messageText }}</p>
            <small>{{ formatDate(msg.sentAt) }}</small>
          </div>
        </router-link>
      </li>
    </ul>

    <p v-if="!loading && messages.length === 0">No messages found.</p>
  </div>
</template>

<style scoped>
.inbox-container {
  padding: 20px;
  font-family: sans-serif;
}

.message-preview {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error {
  color: red;
}
</style>
