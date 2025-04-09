<script setup lang="ts">
import { markListingAsSold } from '@/services/listingApi'
import type { SaleResponse } from '@/types/dto'
import { handleApiError } from '@/utils/handleApiError'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const listingId = Number(route.params.id)

// Form state
const fullName = ref('')
const phoneNumber = ref('')
const visaCardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')
const deliveryAddress = ref('')
const deliveryInstructions = ref('')

// Payment process states
const isProcessing = ref(false)
const purchaseSuccess = ref(false)
const errorMessage = ref('')

const saleResponse = ref<SaleResponse | null>(null)

const formatDate = (iso: string) => new Date(iso).toLocaleString()

// Simulate a purchase API call
const submitPurchase = async () => {
  // Basic validation
  if (
    !fullName.value ||
    !phoneNumber.value ||
    !visaCardNumber.value ||
    !expiryDate.value ||
    !cvv.value ||
    !deliveryAddress.value
  ) {
    errorMessage.value = t('Please fill all required fields.')
    return
  }
  errorMessage.value = ''
  isProcessing.value = true

  try {
    const response = await markListingAsSold(listingId);
    saleResponse.value = response;
    purchaseSuccess.value = true;
  } catch (error) {
    errorMessage.value = handleApiError(error)
  } finally {
    isProcessing.value = false;
  }
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <main class="checkout-portal">
    <div class="checkout-form-container" v-if="!purchaseSuccess">
      <h1>{{ t('Checkout') }}</h1>
      <p>{{ t('Please fill in your details to complete the purchase.') }}</p>
      <form @submit.prevent="submitPurchase" class="checkout-form">
        <div class="form-group">
          <label for="fullName">{{ t('Full Name') }}</label>
          <input type="text" id="fullName" v-model="fullName" placeholder="John Doe" />
        </div>

        <div class="form-group">
          <label for="phoneNumber">{{ t('Phone Number') }}</label>
          <input
            type="tel"
            id="phoneNumber"
            v-model="phoneNumber"
            placeholder="+47 46213162"

          />
        </div>

        <div class="form-group">
          <label for="visaCardNumber">{{ t('Visa Card Number') }}</label>
          <input
            type="text"
            id="visaCardNumber"
            v-model="visaCardNumber"
            placeholder="xxxx xxxx xxxx xxxx"

          />
        </div>

        <div class="form-group inline">
          <div>
            <label for="expiryDate">{{ t('Expiry Date') }}</label>
            <input type="text" id="expiryDate" v-model="expiryDate" placeholder="MM/YY" />
          </div>
          <div>
            <label for="cvv">{{ t('CVV') }}</label>
            <input type="text" id="cvv" v-model="cvv" placeholder="123" />
          </div>
        </div>

        <div class="form-group">
          <label for="deliveryAddress">{{ t('Delivery Address') }}</label>
          <input
            type="text"
            id="deliveryAddress"
            v-model="deliveryAddress"
            placeholder="123 Main St"
          />
        </div>

        <div class="form-group">
          <label for="deliveryInstructions">{{ t('Delivery Instructions') }}</label>
          <textarea
            id="deliveryInstructions"
            v-model="deliveryInstructions"
            placeholder="Leave at the front door"
          ></textarea>
        </div>

        <div class="form-group">
          <button type="submit" :disabled="isProcessing">
            {{ isProcessing ? t('Processing...') : t('Complete Purchase') }}
          </button>
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>
    </div>

    <div v-else class="success-message">
      <p>{{ t('Purchase successful!') }}</p>
      <div v-if="saleResponse">
        <p> {{ t('Sale Price') }}: {{ saleResponse.salePrice }}</p>
        <p> {{ t('Sale Date') }}: {{ formatDate(saleResponse.saleDate) }}</p>
      </div>

      <button @click="goHome">{{ t('Return Home') }}</button>
    </div>
  </main>
</template>

<style scoped>
.checkout-portal {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.checkout-form-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 2rem;
  background: #fafafa;
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.inline {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.form-group label {
  padding-right: 10px;
}

.form-group.inline > div {
  flex: 1;
}

label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input,
textarea {
  resize: vertical;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.75rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  text-align: center;
}

.success-message {
  text-align: center;
  margin-top: 2rem;
}

.success-message button {
  background-color: #007bff;
  margin-top: 1rem;
}
</style>
