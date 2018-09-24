<template lang='pug'>
  div.hero.is-info
    div(style='padding: 20px'): slot
    div.band__wrapper: div(align='center')
      span.card__wrapper(v-for='e in events') 
        LittleCard(:value='e')
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Getter, Action, Mutation, namespace } from "vuex-class";
import LittleCard from "@/components/LittleCard.vue";
@Component({
  components: { LittleCard }
})
export default class Navigate extends Vue {
  get events() {
    return require("./dump_event.json");
  }
}
</script>

<style lang='stylus' scoped>
.band__wrapper {
  overflow-x: scroll; 
  white-space: nowrap; 
  -webkit-overflow-scrolling: touch;
}
.card__wrapper {
  display: inline-flex; 
  padding: 0px 0px 30px 20px;
}
.hero.is-info {
  color: #363636
  background-image: linear-gradient(#209cee, #eeaaaa) !important;
}
</style>
