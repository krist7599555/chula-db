import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import "buefy/dist/buefy.css";
import "bulma/bulma.sass";
import "./style/font.css";
import "./style/style.scss";
import "font-awesome/css/font-awesome.css";
import "font-awesome/fonts/fontawesome-webfont.woff2";

import Navigate from "@/components/Navigate.vue";
import Footer from "@/components/Footer.vue";
import InputComp from "@/components/InputComponent.vue";
import Spinner from "@/components/Spinner.vue";
Vue.component("NAVIGATE", Navigate);
Vue.component("FOOTER", Footer);
Vue.component("INPUTCOMP", InputComp);
Vue.component("SPINNER", Spinner);

import Buefy from "buefy";
Vue.use(Buefy);

// const VueBarcodeScanner = require('vue-barcode-scanner');
// let options = {
//   sound: true, // default is false
//   soundSrc: '/static/sound.wav', // default is blank
//   sensitivity: 300, // default is 100
//   requiredAttr: true // default is false
// }
// Vue.use(VueBarcodeScanner, options);

// const LocationPicker = require("vue2-location-picker");
// Vue.use(LocationPicker, {
//   installComponents: false // If true, create it globally
// });

// const VueMaterial = require("vue-material");
// Vue.use(VueMaterial);

import VueResource from "vue-resource";
Vue.use(VueResource);

import googleConfig from "./common/config";

const VueGoogleMaps = require("vue2-google-maps");
Vue.use(VueGoogleMaps, {
  load: {
    key: googleConfig.apiKey,
    libraries: "places"
  }
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
  mounted() {
    // Detects if device is on iOS
    // const isIos = () => {
    //   const userAgent = window.navigator.userAgent.toLowerCase();
    //   return /iphone|ipad|ipod/.test( userAgent );
    // }
    // // Detects if device is in standalone mode
    // const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
    // // Checks if should display install popup notification:
    // if (isIos() && !isInStandaloneMode()) {
    //   // alert("YES - Iphone/Ipad/Ipod")
    //   // this.$set(this, 'showInstallMessage', true);
    // } else {
    //   // alert("NOT - Iphone/Ipad/Ipod")
    // }
  }
}).$mount("#app");

Vue.prototype.window = window;
