<script setup lang="ts">
</script>

<template>
  <div>
    <!-- Viser "Loading..." mens loading er true -->
    <div v-if="loading">Loading...</div>

    <!-- Når loading er ferdig, vises søkeresultatene i en liste -->
    <ul v-else>
      <!-- Går gjennom hvert resultat og viser det i et <li> -->
      <li v-for="r in results" :key="r.id">{{ r.title }}</li>
    </ul>
  </div>
</template>
