<template lang='pug'>
  div(style='max-width: 100%')
    Navigate(@showMessage='notificateHandle')
    EventBand
      transition(name="fade")
        div.notification.is-warning.chula-nw.is-size-5(align='center' v-show='notificateMessageShow').
          #[button.delete(@click='notificateMessageShow = false')] 
          {{notificateMessage}}
      div.title.chula-nw EVENT
    Footer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Footer from "@/components/Footer.vue";
import Navigate from "@/components/Navigate.vue";
import EventBand from "./component/EventBand.vue";
import { setTimeout } from "timers";

@Component({
  components: { Navigate, EventBand, Footer }
})
export default class Home extends Vue {
  private notificateMessage: string = "empty message";
  private notificateMessageShow: boolean = false;

  notificateHandle(message: string) {
    this.notificateMessage = message;
    this.notificateMessageShow = true;
    setTimeout(() => {
      this.notificateMessageShow = false;
    }, 20000);
  }
}
</script>

<style lang="stylus" scoped>
.hero {
  @media screen and (min-height 700px){
    padding-top 5vh;
  }
}
.bg {
  height: 100vh;
  background-size: cover;
  // background-image: url('../../asset/harrypotter/wall.crop.jpg');
  // background-image: url(https://cdnb.artstation.com/p/assets/images/images/000/433/851/large/florent-llamas-poudlard.jpg?1422302855);
  background-blend-mode: luminosity;
  background-position: 15% 0%; 
}
.white {
  color: white !important;
}
.logo {
  max-width 500px;
  padding 2rem;
  margin: 0 auto;
}
input[type=number] {
    -moz-appearance: textfield;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
.columns .column.fill {
  margin: 0 !important
  padding: 0 !important
}

.resp-container {
    position: relative;
    overflow: hidden;
    // padding-top: 56.25%;
    height 830px;
}
.resp-iframe {
    // position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
