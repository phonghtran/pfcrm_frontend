<template>
  <div class="home">
    <h1>Users</h1>

    <UsersSearch />
  </div>
</template>

<script>
  // @ is an alias to /src

  import UsersSearch from "@/components/UsersSearch.vue";

  export default {
    name: "Users",
    components: { UsersSearch },
  };
</script>
