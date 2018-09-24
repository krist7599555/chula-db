<template lang='pug'>
  section.section
    section.hero.is-medium
      div.hero-body
        div(style='justify-content: center;')
          figure.image
            img.logo(src='@/asset/engineer.png')
          span.is-size-2.chula-nw.fbold Error : Not Found 404

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
