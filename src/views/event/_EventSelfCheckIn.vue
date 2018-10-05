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

      //- div.resp-container
      //.resp-iframe
      div#map-wrapper.iframe-container
        iframe(
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.7142169963818!2d100.52881971500452!3d13.735744290357863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ed541fd23f1%3A0xf4388ad38001af77!2z4Lit4LiH4LiE4LmM4LiB4Liy4Lij4Lia4Lij4Li04Lir4Liy4Lij4Liq4LmC4Lih4Liq4Lij4LiZ4Li04Liq4Li04LiV4LiI4Li44Lis4Liy4Lil4LiH4LiB4Lij4LiT4LmM4Lih4Lir4Liy4Lin4Li04LiX4Lii4Liy4Lil4Lix4LiiICjguK3guJrguIguKQ!5e0!3m2!1sth!2sth!4v1538392652979'
          width='600', 
          height='450',
          frameborder='0', 
          style='border:0', 
          allowfullscreen=''
        )
          SPINNER
      br
      br
      // LOGIN
      div(v-if='false && !isAuthenticated')
        div.container
            BigLoginBtn(@finish='checkIn')

      // NOTIFICATION
      div(v-else-if='message')
        div.container
          i.fa.fa-frown-o(style='font-size: 10rem')
          div.is-size-2(style='white-space: pre-wrap') {{message}}
          //- br
          //- button.button(
          //-   v-if='message != "Bad request!"'
          //-   @click='$store.dispatch("logout")'
          //- ) LOGOUT
      
      // LOADING
      div(v-else-if='waiting')
        SPINNER(
          size='100'
          :line-size='14'
          line-fg-color='#fff'
          line-bg-color='#fff3'
        )
        div.is-size-1 waiting....
    
      // NOTIFICATION: DENINE
      div(v-else-if='locationStatus == "denied"').
        Permission for geolocation is denined #[br]
        Please enable it manualy in setting

      // ALLOW GPS BUTTON
      div(v-if='true')
        button.button.is-success.is-size-1.is-rounded(@click='userAllow = true; geolocate()') 
          div #[i.fa.fa-map-marked-alt]

      // CURRENT LAT/LNG
      div(v-if='locationStatus === "granted" && currentPlace.lat != 0')
        br
        br
        table.table.is-narrow(style='background-color: transparent; color: white') 
          tbody.is-size-5
            tr 
              td lat
              td {{currentPlace.lat | formatLatLng}} 
              td ° N
            tr
              td lng
              td {{currentPlace.lng | formatLatLng}} 
              td ° W
            tr 
              td lat center
              td {{center.lat | formatLatLng}} 
              td ° N
            tr 
              td lng center
              td {{center.lng | formatLatLng}} 
              td ° W
            tr 
              td accuracy
              td {{currentPlace.accuracy}} 
              td meter
            tr 
              td distance
              td {{centerDistance | formatMeter}} 
              td meter
            tr
              td need more
              td {{needMoreDistance | formatMeter}} 
              td meter
      br
      //- div.field
      //-   table.is-size-4: tbody
      //-     tr 
      //-       td.is-pulled-right STUDENT 
      //-       td {{studentCode}}
      //-     tr 
      //-       td.is-pulled-right EVENT
      //-       td {{event}}
      //- br
      // USER INFO
      div.field
        p.is-size-4 {{user.titleTH}} {{user.nameTH}} {{user.surnameTH}}
        p.is-size-4 {{user.faculty}}

      // BACK TO EVENT         
      router-link#back.is-size-1(:to='`/event/` + paramId')
        i.fa.fa-chevron-circle-left
    
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
import { distance } from "@/components/HaversineFormula";
import { log } from "util";

var numeral = require("numeral");
Vue.filter("formatLatLng", function(value: any) {
  return numeral(value).format("0.00000"); // displaying other groupings/separators is possible, look at the docs
});
Vue.filter("formatMeter", function(value: any) {
  return numeral(value).format("0.00"); // displaying other groupings/separators is possible, look at the docs
});

interface Coordinate {
  lat: number;
  lng: number;
  area?: number;
  accuracy?: number; // meter
}

@Component({
  components: { BigLoginBtn }
})
export default class Event extends Vue {
  private user: object = {};
  private event: string = "";
  private studentCode: string = "";
  private message: string = "";
  private waiting: boolean = true;

  // private markers: Array<Coordinate> = [{ lat: 13.6950702, lng: 100.6442417, area: 50}]; // prop
  private isCheckIn: boolean = false; // prop

  // private center: Coordinate = { lat: 0.0, lng: 0.0 };
  private center: Coordinate = { lat: 13.7358303, lng: 100.5308921, area: 50 };
  private currentPlace: Coordinate = { lat: 0.0, lng: 0.0 };
  private loading: boolean = true;
  private locationStatus: string = "granted";
  private userAllow: boolean = false;

  @Getter("isAuthenticated")
  isAuthenticated!: boolean;

  async created() {
    if (this.isAuthenticated) {
      // this.checkIn();
      this.geolocate();
    }
    this.waiting = false;
  }
  async checkIn() {
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
  // get cycleDistance() {
  //   return _.map(this.markers, coor => {
  //     return distance(coor, this.currentPlace) - coor.area;
  //   });
  // }
  // get centerDistance() {
  //   return _.map(this.markers, coor => {
  //     return distance(coor, this.currentPlace);
  //   });
  // }
  get centerDistance() {
    return distance(this.center, this.currentPlace);
  }
  get needMoreDistance() {
    return _.max([0, this.centerDistance - (_.get(this, "center.area") || 0)]);
  }
  // get minCenterDistance() {
  //   return _.min(this.centerDistance);
  // }
  // get minCycleDistance() {
  //   return _.max([0, _.min(this.cycleDistance)]);
  // }
  get paramId() {
    return this.$route.params.id;
  }
  // dragend(a: any) {
  //   let lat = a.latLng.lat();
  //   let lng = a.latLng.lng();
  //   this.currentPlace = { lat, lng };
  // }
  // setPlace(place: Coordinate) {
  //   this.currentPlace = place;
  //   console.log(this.currentPlace);
  // }
  // addMarker() {
  //   if (this.currentPlace) {
  //     const marker = {
  //       lat: this.currentPlace.geometry.location.lat(),
  //       lng: this.currentPlace.geometry.location.lng()
  //     };
  //     this.markers.push({ position: marker });
  //     this.center = marker;
  //     this.currentPlace = null;
  //   }
  // },
  async geolocate() {
    console.log("geo locate");
    this.loading = true;
    // let result = await navigator.permissions.query({ name: "geolocation" });
    // console.log("result", result);
    this.locationStatus = "granted"; //result.state;
    if (
      // true
      this.locationStatus === "granted"
      // result.state === "prompt" && this.userAllow
    ) {
      navigator.geolocation.watchPosition(
        // navigator.geolocation.getCurrentPosition(
        (position: any) => {
          this.loading = false;
          this.currentPlace = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          console.log(this.currentPlace);
        },
        (fail: any) => {
          console.log("geo location is blocked");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.log("permission is denied");
    }
    this.loading = false;
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
