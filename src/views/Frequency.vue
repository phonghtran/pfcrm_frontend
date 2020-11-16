<template>
  <div class="home">
    <h1>Frequency</h1>

    <GraphFrequency />
  </div>
</template>

<script>
  // @ is an alias to /src
  import GraphFrequency from "@/components/GraphFrequency.vue";

  export default {
    name: "Frequency",
    components: { GraphFrequency },
  };
</script>
