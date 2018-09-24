
<template>
  <quagga-scanner
  >
  </quagga-scanner>
</template>

<script>
import { QuaggaScanner } from "vue-quaggajs";

export default {
  components: {
    QuaggaScanner
  },
  methods: {
    detect(result) {
      console.log(result);
    }
  }
};
</script>
