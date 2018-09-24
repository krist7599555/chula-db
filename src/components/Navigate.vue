<template lang='pug'>
<nav class="navbar is-transparent is-dark">

  <div class="navbar-brand">
    router-link.navbar-item(to='/')
      //- img(src="https://bulma.io/images/bulma-logo-white.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28")
      img(:src='require("../asset/logo-chula-sub-white-240x120.png")')
      div(style='margin-top: 1rem; margin-left: .3rem;') 
        span.sub.is-size-7 0.2.4
      //- img(:src='require("../asset/logo-chula-2018-white-535x120.png")')
      //- img(src="http://3mt.eng.chula.ac.th/img/cu-eng-logo.png" width="132" height="28")
    div.navbar-burger.burger(@click="navshow = !navshow" :class='navClass' )
      span
      span
      span
  </div>

  <div class="navbar-menu chula-ch" :class="navClass">
    div.navbar-start
      router-link.navbar-item(to='/') Home
      router-link.navbar-item(to='/self') Profile
      router-link.navbar-item(to='/event') Event
      a.navbar-item(@click='hardReload') Reload
      //- div.navbar-item.has-dropdown.is-hoverable
      //-   a.navbar-link More
      //-   div.navbar-dropdown.is-boxed
      //-     router-link.navbar-item(to='/event') Event
      //-     router-link.navbar-item(to='/person') Person
      //-     router-link.navbar-item(to='/event') Event
      //-     router-link.navbar-item(to='/event') Event
      //-     hr.navbar-divider
      //-     a.navbar-item Elements
      //-     a.navbar-item.is-active Components

    div.navbar-end
      div.navbar-item
        div.field.is-grouped
          p.control
            button.button.is-dark(@click='toggleSign' style='filter: brightness(150%)')
              //- button#sign-btn.button.is-link(@click='toggleSign')
              span.icon
                i.fas.fa-sign-in.fa
              span {{isAuth ? "Log out": "Log in"}} 
          //- div.navbar-item
        //- div.control.is-tablet(v-if="isAuth" style='max-height: unset')
        //-   img.user.is-36x36(:src='user.photoURL')
      
  </div>
</nav>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Getter, Action, Mutation, namespace } from "vuex-class";
import { LOGIN, LOGOUT } from "@/store/actions.type";

@Component({
  components: {}
})
export default class Navigate extends Vue {
  public navshow: boolean = false;
  @Getter("currentUser")
  user: any;
  @Getter("studentCode")
  studentCode!: string;
  @Getter("isAuthenticated")
  isAuth: any;
  get navClass() {
    return {
      "is-active": this.navshow
    };
  }
  async toggleSign() {
    if (this.isAuth) {
      await this.$store.dispatch(LOGOUT);
      this.$emit("showMessage", "log out success");
    } else {
      await this.$store.dispatch(LOGIN);
      this.$emit("showMessage", "log in success");
    }
  }
  hardReload() {
    location.reload(true);
  }
}
</script>

<style lang="stylus" scoped>
.user {
  // display: block;
  max-width: 100%;
  width: auto;
  max-height: 100%;
  border-radius: 10000px;
  // height: auto;
}

.is-38x38 {
  width: 38px;
  height: 38px;
}
</style>
