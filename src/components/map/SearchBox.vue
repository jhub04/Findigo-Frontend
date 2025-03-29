<template>
  <input
    ref="inputRef"
    type="text"
    placeholder="Søk etter adresse"
    class="search-input"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (!window.google || !inputRef.value) return

  const autocomplete = new window.google.maps.places.Autocomplete(inputRef.value, {
    types: ['geocode'],
    componentRestrictions: { country: 'no' }
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    const location = place.geometry?.location
    if (location) {
      const lat = location.lat()
      const lng = location.lng()
      // 🔁 Du kan nå emitte, navigere, zoome, markere osv.
      console.log('Valgt posisjon:', lat, lng)
    }
  })
})
</script>

<style scoped>
.search-input {
  width: 95%;
  padding: 0.6rem;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 1rem;
  display: block;
  border-radius: 5px;
}
</style>
