<template>
  <div class="home">
    <h1>Home</h1>

    <SocialTemp />
    <CommStyle />
    <UserRank />
  </div>
</template>

<script>
  // @ is an alias to /src
  import UserRank from "@/components/UserRank.vue";
  import CommStyle from "@/components/CommStyle.vue";

  import SocialTemp from "@/components/SocialTemp.vue";

  export default {
    name: "Home",
    components: { UserRank, CommStyle, SocialTemp },
  };
</script>
