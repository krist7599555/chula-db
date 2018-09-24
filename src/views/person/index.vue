<template lang='pug'>
div
  Navigate
  div.columns.is-marginless
    div.column.is-paddingless.is-3.is-hidden-mobile(v-if='$store.getters.isAuthenticated')
      SideBar
    div.column.is-paddingless
      div.section.bg(align='center')
        template(v-if='!$store.getters.isAuthenticated')
          div.is-light(style='border-radius: 50px; opacity: .5; border: 10px whitesmoke solid; width: 320px; height: 320px; padding: 10px')
            button.button.is-light.is-medium(
              @click='$store.dispatch("login")'
              style='width: 280px; height: 280px; opacity: 1; border-radius: 40px; font-size: 2rem'
            ) LOGIN
        template(v-else)
          div.box.chula-nw(align='center')
            div.columns
              div.column.is-7
                div.profile__wrapper(v-if='studentCode == paramId' align='center')
                  img.profile__image(:src='userLog.photoURL' style='border-radius: 6px')
              div.column.is-marginless.is-hidden-mobile
                div(align='left' style='margin: 1rem')
                  aside.menu
                    br
                    p.menu-label STUDENT CODE 
                    ul.menu-list
                      li: a.is-size-6 {{records.studentCode}}
                    br
                    p.menu-label NAME 
                    ul.menu-list
                      li: a.is-size-6 {{records.titleTH}} {{records.nameTH}} {{records.surnameTH}}
                      li: a.is-size-6 {{records.titleEN}} {{records.nameEN}} {{records.surnameEN}}
                    br
                    p.menu-label FACULTY 
                    ul.menu-list
                      li: a.is-size-6 {{records.faculty}}

                        
            SPINNER(v-if='isloading')
            NavigateTab(v-else)
            //- router-view
            br
            button.button.is-warning.is-fullwidth(@click='updateUser') update user
  Footer
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { unregister } from "register-service-worker";
import { Getter, Action } from "vuex-class";
import { LOGOUT, UPDATE_USER } from "@/store/actions.type";
import Spinner from "@/components/Spinner.vue";
import InputComp from "@/components/InputComponent.vue";
import TabPublic from "./subtab/public.vue";
import _ from "lodash";
import Navigate from "@/components/Navigate.vue";
import Footer from "@/components/Footer.vue";
import SideBar from "@/components/SideBar.vue";
import NavigateTab from "./components/navigateTab.vue";
import { setInterval } from "timers";

@Component({
  components: {
    Spinner,
    InputComp,
    TabPublic,
    Navigate,
    Footer,
    SideBar,
    NavigateTab
  }
})
export default class Home extends Vue {
  private edits: object = {};
  private records: object = {};
  private isloading: boolean = false;
  private formValidate: object = require("@/other/formValidate.json");
  @Getter("getLayout")
  layout!: object;
  @Getter("userLog")
  userLog: any;
  @Getter("studentCode")
  studentCode!: string;
  @Getter("isAuthenticated")
  isAuth: any;

  // CYCLE HOOK
  async created() {
    this.isloading = true;
    let paramId = this.paramId;
    this.records = await this.$store.getters.userInfo;
    this.isloading = false;
    setInterval(() => {
      if (this.isAuth && this.$route.path == "/users/_") {
        this.$router.push("/users");
      }
    }, 1000);
  }

  // COMPUTED
  get paramId(): string {
    return this.$route.params.id;
  }
  get keys(): string[] {
    return Object.keys(this.records);
  }
  get isEditing() {
    return !_.some(_.values(this.edits), Boolean);
  }

  // METHOD
  logout() {
    this.$store.dispatch(LOGOUT);
    this.$router.push("/login");
  }
  setEdits(key: string, val: boolean) {
    this.$set(this.edits, key, val);
  }
  hasEdits(key: string): boolean {
    return key in this.edits;
  }
  isImage(str: string): boolean {
    return !!String(str).match(/image|.jpg|.jpeg|.png/g);
  }
  valid(atr: string, val: string) {
    this.setEdits(atr, false);
  }
  updateUser() {
    this.isloading = true;
    this.$store.dispatch(UPDATE_USER, this.records).then(() => {
      this.isloading = false;
      this.edits = {};
    });
  }
  tabClass(str: string) {
    return {
      "is-active": _.get(this, "$route.name") == str
    };
  }
}
</script>

<style lang="stylus" scoped>
>>> input.input {
  font-family: ChulaNew;
}

.section {
  @media screen and (max-width: 500px) {
    padding: 3rem 0.5rem;
  }
}

.box {
  // overflow: scroll;
  max-width: 700px;

  @media screen and (max-width: 500px) {
    padding: 0.7rem;
  }
}

.box.student-code__header {
  @media screen and (max-width: 500px) {
    margin-top: -5rem;
    padding-bottom: 1rem;
    padding-top: 3rem;
  }
}

.bg {
  background-image: linear-gradient(#209cee, #eeaaaa) !important;
  background-image: url('https://www.rgf.com/wp-content/uploads/2017/04/Engineer-it-background-1.jpg'); // www.rgf.com/wp-content/uploads/2017/04/Engineer-it-background-1.jpg);
  background-blend-mode: darken;
  // background-color: #94013d;
  // background-color: cover;
  // // height: 100vh;
  background-attachment: fixed;
}

.profile__wrapper {
  border-radius: 10px;
  overflow: hidden;
  margin: 1rem;
  // text-align: left;
}

.profile__image {
  // max-width 300px;
  padding: 0;
  margin: 0;
}

a.is-size-6 {
  color: #363636;
  font-weight: bold;

  &::before {
    content: '';
  }
}
</style>
