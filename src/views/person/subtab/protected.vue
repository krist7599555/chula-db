<template lang="pug">
  div
    div.field.is-narrow.is-horizontal
      div.field-label.is-normal.is-pulled-left 
        label.label วันเกิด
      div.field-body
        div.field: INPUTCOMP(v-model='value.birthDate' :detail='formValidate.birthDate')
        div.field: INPUTCOMP(v-model='value.birthMonth' :detail='formValidate.birthMonth')
        div.field: INPUTCOMP(v-model='value.birthYear' :detail='formValidate.birthYear')
    hr
    div.field.is-narrow.is-horizontal(
      :addons="false" 
      v-for='f in keys'
    )
      div.field-label.is-normal.is-pulled-left
        label.label {{formValidate[f] && formValidate[f].label || f}}
      div.field-body
        div.field
          INPUTCOMP(
            ref='inputComp'
            v-model='value[f]'
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
export default class ProtectedTab extends Vue {
  @Getter("userInfo")
  value!: object;
  get formValidate() {
    return require("@/other/formValidate.json");
  }
  get keys() {
    const { protected_field: field } = require("@/other/layout.js");
    return field || _.keys(this.value);
  }
}
</script>

<style lang="stylus" scoped>

</style>
