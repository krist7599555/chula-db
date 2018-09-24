<template lang='pug'>
div.chula-nw.has-text-white.bg(align='center')
  section.section
    
    template(v-if='!isAuthenticated')
      div.container
          BigLoginBtn(@finish='getRespond')

    template(v-else-if='message')
      div.container
        i.fa.fa-frown-o(style='font-size: 10rem')
        div.is-size-2(style='white-space: pre-wrap') {{message}}
        //- br
        //- button.button(
        //-   v-if='message != "Bad request!"'
        //-   @click='$store.dispatch("logout")'
        //- ) LOGOUT
    
    template(v-else)
      div(v-if='waiting')
        SPINNER(
          size='100'
          :line-size='14'
          line-fg-color='#fff'
          line-bg-color='#fff3'
        )
        div.is-size-1 waiting....
      div(v-else)
        i.fa.fa-smile-o(style='font-size: 10rem')
        div.is-size-2 check in complete
      br
      div.field
        table.is-size-4: tbody
          tr 
            td.is-pulled-right STUDENT 
            td {{studentCode}}
          tr 
            td.is-pulled-right EVENT
            td {{event}}
      br
      div.field
        p.is-size-4 {{user.titleTH}} {{user.nameTH}} {{user.surnameTH}}
        p.is-size-4 {{user.faculty}}
    
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  UPDATE_USER,
  ADD_USER_TO_EVENT,
  PARTICIPATE_EVENT,
  REMOVE_USER_FROM_EVENT
} from "@/store/actions.type";
import Spinner from "@/components/Spinner.vue";
import InputComp from "@/components/InputComponent.vue";
import GMapComp from "@/components/GoogleMap.vue";
import BigLoginBtn from "@/components/BigLoginBtn.vue";
import _ from "lodash";
import { Getter, Action } from "vuex-class";
import { setTimeout } from "timers";

@Component({
  components: { BigLoginBtn }
})
export default class Event extends Vue {
  private user: object = {};
  private event: string = "";
  private studentCode: string = "";
  private message: string = "";
  private waiting: boolean = true;

  @Getter("isAuthenticated")
  isAuthenticated!: boolean;

  async created() {
    let { event, studentCode } = this.$route.query;
    this.event = event;
    this.studentCode = studentCode;
    if (!event || !studentCode || !/[0-9]{10}/.test(studentCode)) {
      this.message = "Bad request!";
      return;
    }
    if (this.isAuthenticated) {
      this.getRespond();
    }
  }
  async getRespond() {
    let res = await this.$store.dispatch("checkIn", {
      event: this.event,
      studentCode: this.studentCode
    });
    if (res.success) {
      this.user = res.respond;
    } else {
      this.message = res.message;
    }
    this.waiting = false;
  }
}
</script>

<style lang="stylus" scoped>
.bg {

  background-color: #202020;
  background-image: url(https://www.chula.ac.th/wp-content/uploads/2018/03/faculty-hero-1440x900.jpg);
  background-size: cover;
  background-attachment: fixed;
  background-blend-mode: overlay;
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
}

td {
  padding: 0.2em 0.4em;
  vertical-align: top;
}
</style>
