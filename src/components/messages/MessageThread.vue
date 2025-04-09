<script setup lang="ts">
import { fetchMessageThread, sendMessage } from '@/services/messageApi'
import { useCurrentUser } from '@/composables/useCurrentUser'
import type { MessageResponse, MessageRequest } from '@/types/dto'
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { otherUsername } from '@/composables/useMessageThread'

const { t } = useI18n()
const route = useRoute()
const otherUserId = Number(route.params.userId)

const { user, isLoading: userLoading, error: userError } = useCurrentUser()
const messages = ref<MessageResponse[]>([])
const loading = ref(false)
const error = ref('')

const newMessageText = ref('')
const sending = ref(false)

const sendMessageToUser = async () => {
  if (!user.value || !newMessageText.value.trim()) {
    console.warn('User not loaded or message is empty', user.value)
    return
  }

  sending.value = true

  const messageRequest: MessageRequest = {
    fromUserId: user.value.id,
    toUserId: otherUserId,
    messageText: newMessageText.value.trim(),
  }

  try {
    await sendMessage(messageRequest)
    newMessageText.value = ''
    messages.value = await fetchMessageThread(user.value.id, otherUserId)
  } catch (e) {
    console.log('Failed to send message', e)
  } finally {
    sending.value = false
  }
}

watch(
  user,
  async (newUser) => {
    if (!newUser) return

    loading.value = true
    try {
      messages.value = await fetchMessageThread(newUser.id, otherUserId)
    } catch (e) {
      error.value = t('Failed to fetch conversation.')
      console.error(e)
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

const formatDate = (iso: string) => new Date(iso).toLocaleString()

const sortedMessages = computed(() =>
  [...messages.value].sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()),
)

const canSend = computed(
  () => !!user.value && newMessageText.value.trim().length > 0 && !sending.value,
)

const getOtherUsername = computed(() => {
  if (otherUsername.value) return otherUsername.value;
  
  const msg = messages.value.find(
    (m) => m.fromUserId !== user.value?.id
  ) ?? messages.value[0]

  return msg?.fromUserId === user.value?.id
    ? msg?.toUsername
    : msg?.fromUsername ?? t('Other user')
})
</script>

<template>
  <div class="thread-container">
    <h1>{{ t('Conversation with') }} {{ getOtherUsername }}</h1>

    <p v-if="userLoading || loading">{{ t('Loading conversation...') }}</p>
    <p v-if="userError" class="error">{{ t('Failed to load user data') }}</p>
    <p v-if="error" class="error">{{ error }}</p>

    <ul v-if="!loading && sortedMessages.length">
      <li
        v-for="msg in sortedMessages"
        :key="msg.messageId"
        class="message"
        :class="{ 'other-user': msg.fromUserId !== user!.id }"
      >
        <div class="message-header">
          <strong>{{ msg.fromUserId === user!.id ? t('You') : getOtherUsername }}</strong>
          <span class="timestamp">{{ formatDate(msg.sentAt) }}</span>
        </div>
        <p>{{ msg.messageText }}</p>
      </li>
    </ul>

    <div class="message-input">
      <textarea
        v-model="newMessageText"
        :disabled="sending"
        :placeholder="t('Write a message...')"
        rows="3"
      ></textarea>
      <button @click="sendMessageToUser" :disabled="!canSend">
        {{ sending ? t('Sending...') : t('Send') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.thread-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
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

.message-input {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-input textarea {
  resize: none;
  padding: 10px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.message-input button {
  align-self: flex-end;
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.message-input button:hover {
  background-color: #1565c0;
}

.message-input button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
