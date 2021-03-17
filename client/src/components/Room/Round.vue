<template>
  <div>
    <WordsWriting v-if="wordsWriting" :categoriesG="categories" :playersG="players" :letter="round.letter" :roundTime="time"></WordsWriting>
    <RandomLetter v-if="randomLetter" :letter="round.letter" @end="start"></RandomLetter>
  </div>
</template>

<script>
import WordsWriting from "./Round/WordsWriting";
import RandomLetter from "./Round/RandomLetter";

export default {
  props: ["round", "categories", "players" , "time"],
  components: {
    WordsWriting,
    RandomLetter,
  },
  data: () => ({
    wordsWriting: false,
    randomLetter: true,
  }),
  methods: {
    start() {
      this.randomLetter = false;
      this.wordsWriting = true;
    },
  },
};
</script>

<style></style>
