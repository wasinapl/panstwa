<template>
  <div>
    <Options :options="options" :admin="admin"></Options>
    <PlayersList :players="players" :admin="admin"></PlayersList>
  </div>
</template>

<script>
import Options from "./WaitRoom/Options";
import PlayersList from "./WaitRoom/PlayersList";

export default {
  props: ["options", "admin", "players"],
  components: {
    Options,
    PlayersList,
  },
  data: () => ({}),
};
</script>

<style></style>
