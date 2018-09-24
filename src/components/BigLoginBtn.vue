<template lang="pug">
  div.is-light(style='border-radius: 50px; opacity: .7; border: 10px whitesmoke solid; width: 320px; height: 320px; padding: 10px')
    button.button.is-light.is-medium(
      @click='handleLogin'
      style='width: 280px; height: 280px; opacity: 1; border-radius: 40px; font-size: 2rem'
      :disabled='waiting'
    ) 
      div
        div.is-block.tittle LOGIN
        div.is-block.subtitle(v-if='waiting') please wait a sec..
</template>

<script lang="ts">
import Vue from "vue";
import { setTimeout } from "timers";
export default Vue.extend({
  data() {
    return {
      waiting: false
    };
  },
  methods: {
    handleLogin() {
      this.waiting = true;
      this.$store.dispatch("login").then(() => {
        // location.reload(true);
        this.$emit("finish");
      });
      setTimeout(() => {
        this.waiting = false;
      }, 10000);
    }
  }
});
</script>
