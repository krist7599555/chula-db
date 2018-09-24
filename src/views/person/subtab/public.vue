<template lang="pug">
  div

    div.field.is-narrow.is-horizontal
      div.field-label.is-normal.is-pulled-left 
        label.label ชื่อ-สกุล
      div.field-body
        div.field: INPUTCOMP(v-model='value.titleTH' :detail='formValidate.titleTH')
        div.field: INPUTCOMP(v-model='value.nameTH' :detail='formValidate.nameTH')
        div.field: INPUTCOMP(v-model='value.surnameTH' :detail='formValidate.surnameTH')
    
    div.field.is-narrow.is-horizontal
      div.field-label.is-normal.is-pulled-left 
        label.label Fullname
      div.field-body
        div.field: INPUTCOMP(v-model='value.titleEN' :detail='formValidate.titleEN')
        div.field: INPUTCOMP(v-model='value.nameEN' :detail='formValidate.nameEN')
        div.field: INPUTCOMP(v-model='value.surnameEN' :detail='formValidate.surnameEN')


    hr/
    
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
export default class PublicTab extends Vue {
  private custom = [
    "titleTH",
    "nameTH",
    "surnameTH",
    "titleEN",
    "nameEN",
    "surnameEN"
  ];
  @Getter("userInfo")
  value!: object;
  get formValidate() {
    return require("@/other/formValidate.json");
  }
  get keys() {
    const { public_field: field } = require("@/other/layout.js");
    return (field || _.keys(this.value)).filter(
      (k: string) => !this.custom.includes(k)
    );
  }
}
</script>

<style lang="stylus" scoped>

</style>
