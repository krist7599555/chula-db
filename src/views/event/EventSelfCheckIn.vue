<template lang='pug'>
div
  NAVIGATE
  div.chula-nw.has-text-white.bg(align='center')

    section.section
      // HEADER
      div.field
        p.has-text-white.title SELF CHECKIN
        p.has-text-white.subtitle using GPS to tracking location.
      br
    
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  UPDATE_USER,
  ADD_USER_TO_EVENT,
  PARTICIPATE_EVENT,
  REMOVE_USER_FROM_EVENT
} from "@/store/actions.type";
import InputComp from "@/components/InputComponent.vue";
import GMapComp from "@/components/GoogleMap.vue";
import BigLoginBtn from "@/components/BigLoginBtn.vue";
import _ from "lodash";
import { Getter, Action } from "vuex-class";

@Component({
  components: { BigLoginBtn }
})
export default class EventSelfCheckIn extends Vue {
  @Getter("isAuthenticated")
  isAuthenticated!: boolean;

  private user: object = {};
  private event: string = "";
  private studentCode: string = "";
  private message: string = "";
  private waiting: boolean = true;

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
  get paramId() {
    return this.$route.params.id;
  }
}
</script>

<style lang="stylus" scoped>

.section {
  @media screen and (orientation: landscape){
    width: 80vh;
    padding: 0px;
  }
  @media screen and (orientation: portrait){
    padding: 0px;
    width: 90vw;
  }
}

.bg {
  background-color: #202020;
  background-image: url('https://www.chula.ac.th/wp-content/uploads/2018/03/faculty-hero-1440x900.jpg'); // www.chula.ac.th/wp-content/uploads/2018/03/faculty-hero-1440x900.jpg);
  background-size: cover;
  background-attachment: fixed;
  background-blend-mode: overlay;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg {
  color: #fff
  background-blend-mode: normal;
  background-image: linear-gradient(#209cee, #eeaaaa) !important;
}

td {
  padding: 0.2em 0.4em;
  vertical-align: top;
}

#back {
  color: #36363699;
  &:hover {
    color: #363636ee;
  }
}

#map-wrapper {
  overflow: hidden
  border-radius: 8px
  margin-bottom -7px;s
}

.iframe-container {
  overflow: hidden;
  padding-top: 56.25%;
  position: relative;
}

.iframe-container iframe {
   border: 0;
   height: 100%;
   left: 0;
   position: absolute;
   top: 0;
   width: 100%;
}

</style>
