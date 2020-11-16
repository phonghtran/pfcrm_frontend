<template>
  <div>
    <InitPrep />
  </div>
</template>

<script>
  // @ is an alias to /src
  import InitPrep from "@/components/InitPrep.vue";

  export default {
    name: "Debug",
    components: {
      InitPrep,
    },
  };
</script>
