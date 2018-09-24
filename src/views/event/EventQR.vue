<template lang='pug'>
div
  NAVIGATE
  

  section.section.chula-nw(style='min-height: 95vh'): div(align='center')
    div(v-if='loading')
      SPINNER(
        size='100'
        :line-size='14'
        line-fg-color='#fff'
        line-bg-color='#fff3'
      )

    div.box(v-else align='center' :style='boxStyle')
      div.columns.is-vcentered

        // QR CODE
        div.column
          QRCODE(
            :value='qr_value'
            foreground='#363636'
            background='#fff'
            :className='isAuthenticated ? "" : "canvas_invalid"'
            :size='QRsize'
            level='L'
          )

        // CONTENT
        div.column
          
          // SHOW INFO
          template(v-if='isAuthenticated')
            div.content_wrapper.is-mobile
              div.content
                div.title {{studentCode}}
                div.subtitle {{paramId}}
              div.content
                div {{user.titleTH}} {{user.nameTH}} {{user.surnameTH}}
                div {{user.faculty}}
              div.content(v-if='event_status')
                div(v-if='event_status == "checker"') Role : checker
                div(v-else) checked by {{event_status}} 
          
          // NOT AUTHENTICATED
          template(v-else)
            div.field
              button.button.is-dark.is-fullwidth.is-medium(
                @click='$store.dispatch("login")'
              ) Please Login
    
    // BACK TO EVENT         
    router-link#back.is-size-1(:to='`/event/` + paramId')
      i.fa.fa-chevron-circle-left
      
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import QRCODE from "qrcode.vue";
import _ from "lodash";
import { setInterval } from "timers";

@Component({
  components: { QRCODE }
})
export default class EventQR extends Vue {
  @Getter("studentCode")
  studentCode!: string;
  @Getter("isAuthenticated")
  isAuthenticated!: boolean;
  @Getter("userInfo")
  user!: boolean;
  private loading: boolean = true;
  private screen_w: number = 0;
  private screen_h: number = 0;
  private event_status: string = "";
  async created() {
    this.event_status =
      (await this.$store.getters.userEvent(this.paramId)).stat || "";
    setInterval(() => {
      let { innerWidth: w1, innerHeight: h1 } = window;
      let { clientWidth: w2, clientHeight: h2 } = document.documentElement;
      this.screen_w = _.max([w2]) || 0;
      this.screen_h = _.max([h2]) || 0;
      this.$forceUpdate();
      this.loading = false;
    }, 5);
  }
  get qr_value() {
    return `https://chula.ml/#/checkin?event=${this.paramId}&studentCode=${
      this.studentCode
    }`;
  }
  get paramId() {
    return this.$route.params.id;
  }
  get boxStyle() {
    let norm_size = this.QRsize + 40;
    return {
      width: `${this.screen_w >= 769 ? 750 : norm_size}px`
    };
  }
  get QRsize() {
    let vm = _.min([this.screen_w, this.screen_h]) || 0;
    if (vm <= 320) return 260;
    if (vm <= 414) return vm - 90;
    if (vm <= 690) return vm - 200;
    if (vm <= 768) return vm - 250;
    return 490;
  }
}
</script>

<style lang="stylus" scoped>
.section {
  background-color: #363636;
  background-image: url(https://www.chula.ac.th/wp-content/uploads/2018/03/faculty-hero-1440x900.jpg);
  background-size: cover;
  background-attachment: fixed;
  background-blend-mode: overlay;
  min-height: 100vh;
  @media screen and (max-width: 320px) {
    padding: 3rem .5rem;
  }
}
.canvas_invalid {
  filter: brightness(20%)
}
.content_wrapper {
  text-align: left;
  @media screen and (min-width: 769px) and (orientation: landscape) {
    margin-left: 20px;
  }
}

#back {
  color: #FA7C91DD;
  transition-duration: .1s;
  &:hover {
    color: #FA7C91AA
  }
}

.content:not(:last-child) {
    margin-bottom: 1.2rem;
}
</style>
