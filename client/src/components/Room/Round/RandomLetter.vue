<template>
  <v-container>
    <v-row>
      <v-col
        align="center"
        class="display-4"
        v-text="char"
        v-bind:style="{ 'font-weight': text }"
      >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["letter"],
  data() {
    return {
      time: 10,
      characters: "ABCDEFGHIJKLMNOPRSTUWXYZ",
      char: "A",
      text: "normal",
    };
  },
  mounted() {
    this.changeLetter();
  },
  methods: {
    changeLetter() {
      if (this.time > 300) {
        this.char = this.letter;
        this.text = "bold";
        setTimeout(() => {
          this.$emit('end');
        }, 2000);
      } else {
        this.char = this.characters.charAt(
          Math.floor(Math.random() * this.characters.length)
        );
        this.time = Math.floor(1.1 * this.time);
        setTimeout(this.changeLetter, this.time);
      }
    },
  },
};
</script>

<style></style>
