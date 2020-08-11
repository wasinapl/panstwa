<template>
  <WordsWriting v-if="wordsWriting"></WordsWriting>
</template>

<script>
import WordsWriting from "./Round/WordsWriting";


export default {
    components: {
        WordsWriting,
    },
     data: () => ({ 
         wordsWriting: true,
     }),
}
</script>

<style>

</style>