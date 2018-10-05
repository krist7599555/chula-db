<template lang='pug'>
  section.section
    section.hero.is-medium
      div.hero-body
        div(align='center')
          figure.image
            //- img.logo(src='@/asset/engineer.png')
          div.field: FacebookBtn
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { unregister } from "register-service-worker";
import FacebookBtn from "../../components/FacebookBtn.vue";

@Component({
  components: { FacebookBtn }
})
export default class Home extends Vue {
  public studentCode: string = "";
  routerPerson() {
    if (this.studentCode.match(/[0-9]{10}/)) {
      this.$router.push(`/person/${this.studentCode}`);
    } else {
      alert("please enter 10 digit student code");
    }
  }
}
</script>

<style lang="stylus" scoped>
.logo {
  max-width 500px;
  padding 2rem;
  margin: 0 auto;
}
input[type=number] {
    -moz-appearance: textfield;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>
