<template lang='pug'>
div
  NAVIGATE
  div.section.bg.chula-nw(align='center')

    // COUNTDOWN & NOTIFICATION
    div.box.hero.is-danger(v-if='warningList.length || (e && e.date && e.date.start)')
      div.field(v-if='e && e.date && e.date.start')
        Countdown.has-text-white(:deadline="e.date.start")
      //- div {{e.date.start}}
      div(v-for='m in warningList') {{m}} 
    

    // HEAD
    div.box(v-show='e.name')
      div.title {{e.name}}
      div.subtitle {{e.description}} <br> {{e.location}}

    template(v-if='!$store.getters.isAuthenticated')
      div(style='margin: 20vmin 0')
        BigLoginBtn

    template(v-else-if='loading')
      div(style='margin: 2rem auto')
        SPINNER(
          size='100'
          :line-size='14'
          line-fg-color='#fff'
          line-bg-color='#fff3'
        )
      

    template(v-else)

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

      // SUBMIT BTN
      a.box.hero.is-warning(@click='handleSubmit')
        span.is-size-5 SUBMIT
        span.is-size-3: i.fa.fa-paper-plane
        span.is-size-7(v-if='notiMessage')  {{notiMessage}} #[i.fa.fa-check]

    // QR CODE
    router-link.box.hero.is-primary(:to="`${paramId}/qr`")
      span.is-size-5 QR code
      span.is-size-3: i.fa.fa-qrcode

    router-link.box.hero.is-success(:to="`${paramId}/checkin`")
      span.is-size-5 Self checkin
      //- span.is-size-3: i.fa.fa-map-marked-alt
      span.is-size-3: i.fa.fa-map-marker-alt

    // RECORDS
    router-link.box.hero.is-info(:to="`${paramId}/records`")
        span.is-size-5 Submission
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
import Countdown from "@/components/CountDown.vue";
import _ from "lodash";
import { unregister } from "register-service-worker";
import { Getter, Action } from "vuex-class";
import { log } from "util";
import { constants } from "http2";
import { setInterval } from "timers";

@Component({
  components: { Spinner, InputComp, GMapComp, BigLoginBtn, Countdown }
})
export default class Event extends Vue {
  private e = {}; //require("@/other/dumpevent.json");
  private data: any = {};
  private isEdit: boolean = false;
  private loading: boolean = true;
  private isJoined: boolean = false;
  private frameLoaded: boolean = false;
  private formValidate: any = require("@/other/formValidate.json");
  private notiMessage: string = "";
  @Getter("isAuthenticated")
  isAuthenticated!: boolean;
  private paramCount = 0;

  // CYCLE HOOK
  async created() {
    let t = setTimeout(() => {
      this.loading = false;
      this.warningList.push("ขาดการเชื่อมต่อ");
    }, 5000);
    this.e = await this.$store.getters.eventFormat(this.paramId);
    if (!this.e) {
      this.$router.push(`/404?url=${this.$route.path}`);
    }
    this.data = await this.$store.getters.userInfo;
    this.$forceUpdate();
    this.loading = false;
    clearTimeout(t);
  }

  // COMPUTE
  get paramId(): string {
    if (this.paramCount != 0) window.location.reload(true);
    this.paramCount++;
    return this.$route.params.id;
  }
  get validForm(): boolean {
    if (this.$refs && _.some(this.$refs.inputComp, (e: any) => e.error)) {
      return false;
    }
    if (
      this.data &&
      _.some(_.get(this, "e.specialField") || [], f => !this.data[f])
    ) {
      return false;
    }
    return true;
  }
  get warningList() {
    let deviceNavInfo = this.$store.getters.deviceNavigateInfo;
    let res = [];
    if (deviceNavInfo.includes("Line"))
      res.push("ไม่แนะนำให้เข้าระบบผ่าน line");
    // if (deviceNavInfo.includes("Mobile"))
    //   res.push("ไม่แนะนำให้ให้ดำเนินการผ่านโทรศัพท์");
    return res;
  }

  // METHOD
  async handleSubmit() {
    this.loading = true;
    let { require, specialField }: any = this.e;
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
      console.log("TRY dispatch UPDATE_USER", this.data);
      await this.$store.dispatch(UPDATE_USER, this.data);
      console.log("TRY dispatch ADD_USER_TO_EVENT", submitObject);
      await this.$store.dispatch(ADD_USER_TO_EVENT, {
        event: this.paramId,
        data: submitObject
      });
      this.notiMessage =
        "update Successful: " + new Date().toString().slice(4, 24);
    } catch (err) {
      console.log("error", err);
      this.notiMessage = "update Fail: " + new Date().toString().slice(4, 24);
    }
    this.loading = false;
  }
  checkVisable(info: any) {
    if ("show" in info) {
      let s = info.show;
      _.forEach(this.data || {}, (val, key) => {
        // console.log(s, val, key)
        s = s.replace(key, `this.data['${key}']`);
      });
      try {
        return eval(s);
      } catch (err) {
        return true;
      }
    }
    return true;
  }
}
</script>

<style lang="stylus" scoped>
a.box {
  box-shadow: none !important;
  transition-duration .1s
  -moz-transition-duration .1s
  &:hover {
    filter: brightness(106%)
  }
}

.bg {
  background-color: #363636;
  background-image: url('https://www.chula.ac.th/wp-content/uploads/2018/03/faculty-hero-1440x900.jpg'); // www.chula.ac.th/wp-content/uploads/2018/03/faculty-hero-1440x900.jpg)
  background-size: cover;
  background-attachment: fixed;
  background-blend-mode: overlay;
  min-height: 100vh;

}
// .bg {
//   background-image: linear-gradient(#209cee, #eeaaaa);
//   background-blend-mode: unset;
// }

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
