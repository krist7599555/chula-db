<template lang='pug'>
div
  NAVIGATE
  div.section.bg.chula-nw(align='center')

    //- div.box {{warningList}}
    //- div.box {{$store.getters.deviceNavigateInfo}}
    
    // NOTIFICATION
    div.box.notification.chula-nw.is-danger(v-if='warningList.length')
      div(v-for='m in warningList') {{m}} 

    // HEAD
    div.box
      div.title.is-spaced {{e.name}}
      div.subtitle {{e.description}} <br> {{e.location}}

    template(v-if='!$store.getters.isAuthenticated')
      div(style='margin: 20vmin 0')
        BigLoginBtn

    template(v-else-if='loading')
      SPINNER

    template(v-else)
      //- div.box(style='overflow: hidden')
      //-   div
      //-     div.resp-container(style=`
      //-       margin: -145px -27px -120px; 
      //-       height: 1000px;
      //-     `)
      //-       //- src='https://docs.google.com/forms/d/e/1FAIpQLSfNYVOtEhkNKpKfI417gFyKRomjZV-QU60XS8QccaPdOVudkw/viewform?embedded=true',
      //-       //- src='https://docs.google.com/forms/d/e/1FAIpQLSfNYVOtEhkNKpKfI417gFyKRomjZV-QU60XS8QccaPdOVudkw/viewform?embedded=true',
      //-       //- src='https://docs.google.com/forms/d/e/1FAIpQLSfNYVOtEhkNKpKfI417gFyKRomjZV-QU60XS8QccaPdOVudkw/viewform?embedded=true&usp=pp_url&
      //-       iframe.resp-iframe(
      //-         :src='iframeSrc'
      //-         width='640', 
      //-         height='2615', 
      //-         frameborder='0', 
      //-         marginheight='-30', 
      //-         marginwidth='0'
      //-         @load='frameLoaded = true'
      //-         v-show='frameLoaded'
      //-       )
      //-       div(v-if='!frameLoaded' style='margin-top: 0px')
      //-         SPINNER

      // PERSONAL INFO
      div.box
        div.field
          h1.title.is-size-4.is-spaced ข้อมูลบุคคล
          p.subtitle
        div
          div.field.is-narrow.is-horizontal(v-for='f in e.require' :key='f.id')
            div.field-label.is-normal
              label.label {{formValidate[f].label || f}}
            div.field-body
              div.field
                div.control
                  INPUTCOMP(
                    ref='inputComp'
                    v-model='data[f]'
                    :detail='formValidate[f]'
                    :edit='true'
                  )

      // SPECIAL INFO
      div.box
        div.field
          h1.title.is-size-4.is-spaced ข้อมูลเฉพาะ
          p.subtitle
        div
          div.field.is-narrow.is-horizontal(v-for='f in e.specialField' :key='f.id' v-show='checkVisable(f)')
            div.field-label.is-normal
              label.label {{f.label}}
            div.field-body
              div.field
                div.control
                  INPUTCOMP(
                    ref='inputComp'
                    v-model='data[f.name]'
                    :detail='f'
                    :edit='true'
                  )
      

      // submit BTN
      a
        div.box.hero.is-warning(@click='handleSubmit')
          h1.is-size-5 SUBMIT
          h1.is-size-7(v-if='notiMessage')  {{notiMessage}} #[i.fa.fa-check]
      br
  
    router-link(:to="`${paramId}/records`")
      div.box.hero.is-info 
        span.is-size-5 View Submission
        span.is-size-3: i.fa.fa-table
    div(style='height: 4rem')
  FOOTER
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
import { unregister } from "register-service-worker";
import { Getter, Action } from "vuex-class";

@Component({
  components: { Spinner, InputComp, GMapComp, BigLoginBtn }
})
export default class Event extends Vue {
  private e = require("@/other/dumpevent.json");
  private data: any = {};
  private isEdit: boolean = false;
  private loading: boolean = false;
  private isJoined: boolean = false;
  private frameLoaded: boolean = false;
  private formValidate: any = require("@/other/formValidate.json");
  private notiMessage: string = "";
  @Getter("isAuthenticated")
  isAuthenticated!: boolean;

  // CYCLE HOOK
  async created() {
    this.loading = true;
    this.data = {}; // await this.$store.getters.userInfo;
    this.$forceUpdate();
    this.loading = false;
  }
  async mounted() {}

  // COMPUTED
  get paramId(): string {
    return this.$route.params.id;
  }
  get validForm(): boolean {
    if (this.$refs && _.some(this.$refs.inputComp, (e: any) => e.error)) {
      return false;
    }
    if (this.data && _.some(this.e.specialField || [], f => !this.data[f])) {
      return false;
    }
    return true;
  }
  get warningList() {
    let deviceNavInfo = this.$store.getters.deviceNavigateInfo;
    let res = [];
    if (deviceNavInfo.includes("Line"))
      res.push("ไม่แนะนำให้เข้าระบบผ่าน line");
    if (deviceNavInfo.includes("Mobile"))
      res.push("ไม่แนะนำให้ให้ดำเนินการผ่านโทรศัพท์");
    return res;
  }

  // METHOD
  async handleSubmit() {
    this.loading = true;
    console.log("!!!");
    let { require, specialField } = this.e;
    let submitField = _.concat(require, _.map(specialField, "name"));
    let submitObject = _.reduce(
      submitField,
      (obj: any, field: string) => {
        obj[field] = this.data[field] || "";
        return obj;
      },
      {}
    );
    try {
      await this.$store.dispatch(UPDATE_USER, this.data);
      await this.$store.dispatch(ADD_USER_TO_EVENT, {
        event: this.paramId,
        data: submitObject
      });
      this.notiMessage =
        "update Successful: " + new Date().toString().slice(4, 24);
    } catch (err) {
      this.notiMessage = "update Fail: " + new Date().toString().slice(4, 24);
    }
    this.loading = false;
  }
  checkVisable(info: any) {
    if ("show" in info) {
      let s = info.show;
      _.forEach(this.data, (val, key) => {
        s = s.replace(key, `this.data['${key}']`);
      });
      console.log("eval", s);
      // return eval(s);
    }
    return true;
  }
}
</script>

<style lang="stylus" scoped>
.bg {
  background-color: #363636;
  background-image: url('https://www.chula.ac.th/wp-content/uploads/2018/03/faculty-hero-1440x900.jpg'); // www.chula.ac.th/wp-content/uploads/2018/03/faculty-hero-1440x900.jpg)
  background-size: cover;
  background-attachment: fixed;
  background-blend-mode: overlay;
  min-height: 100vh;
}

.field-label.is-normal {
  @media screen and (max-width: 768px) {
    text-align: left;
  }
}

.section {
  @media screen and (max-width: 500px) {
    padding: 3rem 1rem;
  }
}

.box {
  max-width: 600px;
}

.resp-container {
  position: relative;
  overflow: hidden;
  padding-top: 56.25%;
}

.resp-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
