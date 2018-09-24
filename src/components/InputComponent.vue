<template lang='pug'>
  span.control.is-expanded 
    //{{detail}}
    template(v-if='!detail')
      input.input.is-static(value="No Detail" readonly)
      
    template(v-else-if='is("text")')
      span(v-if='edit')
        input.input.chula-nw(:value='value' @input="updateValue($event.target.value)" @keyup.enter='finish')
        p.help.is-danger(v-if='error') please fill this field {{detail.validate}}
      input(v-else).input.is-static(:value="value" readonly)
    
    template(v-else-if='is("select")')
      template(v-if='edit')
        span.select.is-fullwidth(style='min-width: 100px')
          select.chula-nw.is-fullwidth(v-if='edit' 
            :value='value'
            @input="updateValue($event.target.value)"
            @update="updateValue($event.target.value)"
          )
            option(v-for='v in detail.value' :value='v') {{v}}
        p.help.is-danger(v-if='error') please select this field
      input(v-else).input.is-static(:value="value" readonly)
    
    template(v-else-if='is("groupSelect")')
      template(v-if='edit')
        span.select.is-fullwidth(style='min-width: 100px')
          select.chula-nw.is-fullwidth(
            v-if='edit' 
            :value='value'
            @input="updateValue($event.target.value)"
            @update="updateValue($event.target.value)"
          )
            optgroup(:label="g.label" v-for='g in detail.value')
              option(v-for='v in g.value' :value='v') {{v}}
        p.help.is-danger(v-if='error') please select this field
      input(v-else).input.is-static(:value="value" readonly)
    
    template(v-else-if='is("radio")')
      template(v-if='edit')
        b-radio(v-for='v in detail.value' 
          :value='value'
          @input="v => updateValue(v)"
          @update="v => updateValue(v)"
          :native-value='v'
        ) {{v}}
        p.help.is-danger(v-if='error') please select this field
      input(v-else).input.is-static(:value="value" readonly)
    
    //- template(v-else-if='is("multiRadio")')
    //-   template(v-if='edit')
    //-     h1 
    //-     div.block
    //-       //- b-checkbox(v-model='multiRadio', native-value='Silver') Silver
    //-       //- b-checkbox(v-model='multiRadio', native-value='Flint') Flint
    //-       //- b-checkbox(v-model='multiRadio', native-value='Vane') Vane
    //-       //- b-checkbox(v-model='multiRadio', native-value='Billy', disabled='') Billy
    //-       b-checkbox(
    //-         v-for='v in detail.value' 
    //-         v-model='multiRadio'
    //-         :native-value='v'
    //-       ) {{v}}
    //-     p.help.is-danger(v-if='error') please select this field
    //-   input(v-else).input.is-static(:value="value" readonly)

    template(v-else-if='is("multiChoice")')
      span(v-if='edit')
        label.radio(v-for='v in detail.value' :key='v.id')
          input(type="checkbox" :name='detail.name' v-model='value') 
          |  {{v}}
          p.help.is-danger(v-if='error') {{detail.validate}}
      input(v-else).input.is-static(:value="value" readonly)

    template(v-else-if='is("textarea")')
      b-input.chula-nw(
        v-model='value'
        type='textarea'
      )
    template(v-else-if='is("date")')
      b-datepicker.chula-nw(
        v-model="value"
        placeholder='Click to select...',
        :min-date='new Date("1/1/1990")'
        :max-date='new Date("1/1/2019")'
        :mobile-native='true'
        :readonly="!edit"
      )
    template(v-else) 
      input.input.is-static(:value="`type ERROR: ${detail.type}`" readonly)

</template>

<script lang="js">
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({
  props: {
    value: null,
    detail: {},
    edit: {
      default: true
    }
  }
})
export default class INPUTCOMP extends Vue {
  data() {
    return {
      multiRadioData: []
    }
  }
  mounted() {
    this.updateValue(this.value || this.defaultValue());
  }
  
  // get multiRadio() {
  //     this.$emit('input', this.multiRadioData);
  // }
  get error() {
    if (this.detail.require && !this.value) return true;
    if (this.is("select") || this.is("radio")) {
      return !this.detail.value.includes(this.value)
    } else {
      let valid = this.detail.validate;
      return valid && !RegExp(valid).test(this.value);
    }
  }

  is(type) {
    if (typeof(type) === "string")
      return type === this.detail.type;
    else
      return type.includes(this.detail.typ);
  }
  defaultValue(type) {
    return this.is("multiRadio") || this.is("multiSelect") ? [] : '';
  }
  finish() {
    if (!this.error) {
      this.$emit("finish");
    }
  }
  updateValue(value) {
    this.$emit("input", value);
  }
};
</script>

<style lang="stylus" scoped>
.logo {
  max-width: 500px;
  padding: 2rem;
  margin: 0 auto;
}

input[type=number] {
  -moz-appearance: textfield;
}

input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input, textarea {
  -webkit-box-shadow: none;
  box-shadow: none;
}

>>> textarea.textarea {
  font-family: ChulaNew;
}
</style>
