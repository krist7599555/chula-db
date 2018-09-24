<template lang="pug">
  section.section 
    div.box
      pre {{device}}
    div.box
      pre {{device2}}
</template>

<script>
export default {
  computed: {
    device() {
      return [navigator.userAgent, navigator.vendor, window.opera];
    },
    device2() {
      return {
        navigator: window.navigator,
        vendor: navigator.vendor,
        opera: window.opera
      };
    }
  }
};
</script>

<style lang="stylus" scoped>

</style>
