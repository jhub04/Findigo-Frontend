<template>
  <div>
    <h1>Admin Dashboard</h1>
    <ul>
      <li><router-link to="/admin/category">Category</router-link></li>
      <li><router-link to="/admin/attribute">Attribute</router-link></li>
      <li><router-link to="/admin/user">User</router-link></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
}
a {
  text-decoration: none;
  color: #007bff;
}
a:hover {
  text-decoration: underline;
}
</style>
