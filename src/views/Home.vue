<template>
  <div class="home">
    <h1>Home</h1>

    <SocialTemp />
    <CommStyle />
    <UserRank />

    <EntriesList />
  </div>
</template>

<script>
  // @ is an alias to /src
  import UserRank from "@/components/UserRank.vue";
  import CommStyle from "@/components/CommStyle.vue";
  import EntriesList from "@/components/EntriesList.vue";
  import SocialTemp from "@/components/SocialTemp.vue";

  export default {
    name: "Home",
    components: { UserRank, CommStyle, EntriesList, SocialTemp },
  };
</script>
