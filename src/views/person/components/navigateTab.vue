<template lang="pug">
b-tabs
  b-tab-item(label='Public'): Public
  b-tab-item(label='Protected'): Protected
  //- b-tab-item(label='Subtab'): Subtab 
  //- b-tab-item(label='Surway'): Surway 
</template>

<script>
import Public from "../subtab/public.vue";
import Protected from "../subtab/protected.vue";
import Subtab from "../subtab/event.vue";
import Surway from "../subtab/surway.vue";
export default {
  components: { Public, Protected, Subtab, Surway },
  methods: {
    tabClass(str) {
      return {
        "is-active": this.$route.name == str
      };
    }
  }
};
</script>
