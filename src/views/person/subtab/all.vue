<template lang="pug">
  div
    div.field.is-narrow.is-horizontal(
      :addons="false" 
      v-for='f in keys'
    )
      div.field-label.is-normal.is-pulled-left
        label.label {{formValidate[f] && formValidate[f].label || f}}
      div.field-body
        div.field
          div.control
            INPUTCOMP(
              ref='inputComp'
              :value.sync='value[f]'
              :detail='formValidate[f]'
              :edit='true'
              @finish='isEdit = true'
            )
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import _ from "lodash";

@Component({
  components: {}
})
export default class AllTab extends Vue {
  get value() {
    return this.$parent.$data.records;
  }
  get formValidate() {
    return require("@/other/formValidate.json");
  }
  get keys() {
    return _.keys(this.value);
  }
}
</script>

<style lang="stylus" scoped>

</style>
