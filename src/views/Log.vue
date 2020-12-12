<template>
  <div>
    <h1>Log</h1>
    <LogForm :name="$route.params.name" />
  </div>
</template>

<script>
  // @ is an alias to /src

  import LogForm from "@/components/LogForm.vue";

  export default {
    name: "Log",
    components: { LogForm },
  };
</script>
