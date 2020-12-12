<template>
  <div class="home">
    <h1>Batches</h1>

    <BatchesManagement />
  </div>
</template>

<script>
  // @ is an alias to /src

  import BatchesManagement from "@/components/BatchesManagement.vue";

  export default {
    name: "Batches",
    components: { BatchesManagement },
  };
</script>
