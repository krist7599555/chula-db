<template lang='pug'>
div
  NAVIGATE
  section.hero.is-danger.is-fullheight
    div.hero-body
      div(align='center' style='margin: 0 auto')
        //(style='justify-content: center;')
        //- figure.image
        //-   img.logo(src='@/asset/engineer.png')
        p.is-size-2.chula-nw.fbold.has-text-white Error : Not Found 404
        p.is-size-3.chula-nw.fbold.has-text-white {{$route.path}}

</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
export default class Home extends Vue {}
</script>

<style lang="stylus" scoped>
.logo {
  max-width 500px;
  padding 2rem;
  margin: 0 auto;
}
</style>
