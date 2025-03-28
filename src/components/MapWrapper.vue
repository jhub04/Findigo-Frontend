<template>
  <GMapMap :center="center" :zoom="zoom" style="width: 100%; height: 100%" />
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { GMapMap } from '@fawmi/vue-google-maps'

const { center, zoom } = defineProps<{
  center: { lat: number; lng: number }
  zoom: number
}>()

</script>
