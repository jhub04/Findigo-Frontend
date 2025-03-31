  <script setup lang="ts">

  </script>

  <template>
    <form class="search-form" @submit.prevent="performSearch">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        name="findigo-search"
        autocomplete="off"
      />
      <button type="submit">
        <i class="fa fa-search"></i>
      </button>
    </form>
  </template>



  <style scoped>
  .search-form {
    display: flex;
    width: 100%;
    max-width: 562px;
    border: 1px solid #ccc;
    border-radius: 50px;
    overflow: hidden;
    background: #f1f1f1;
  }

  .search-form input[type="text"] {
    flex: 1;                      /* takes remaining space */
    padding: 10px;
    font-size: 17px;
    border: none;                 /* remove inner border */
    background: #f1f1f1;
    outline: none;
  }

  .search-form button {
    padding: 0 20px;
    background: #2196f3;
    color: white;
    font-size: 17px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-form button:hover {
    background: #0b7dda;
  }

  </style>
