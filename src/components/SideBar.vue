
<template lang='pug'>
aside.menu.section(style='height: 100%')
  p.menu-label General 
  ul.menu-list
    li: a Dashboard
    li: a Customers
  
  p.menu-label Administration 
  ul.menu-list
    li: a Team Settings
    li 
      a.is-active Manage Your Team
      ul
        li: a Members
        li: a Plugins
        li: a Add a member
    li: a Invitations
    li: a Cloud Storage Environment Settings
    li: a Authentication
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
