
<template lang='pug'>
div
  spinner(v-if='isloading')
  button.button.is-rounded.is-large.fb(
    v-else
    @click="isAuth ? handleLogout() : handleLogin()"
  )
    span.icon: i.fa.fa-facebook
    span.chula-nw.fbold {{ isAuth ? "Logout from" : "Login with" }} facebook
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Getter, Action, Mutation, namespace } from "vuex-class";
import Spinner from "@/components/Spinner.vue";

@Component({
  components: { Spinner }
})
export default class Login extends Vue {
  private isloading = false;
  @Getter("currentUser")
  user: any;
  @Getter("studentCode")
  studentCode!: string;
  @Getter("isAuthenticated")
  isAuth: any;
  @Action
  login: any;
  @Action
  logout: any;

  async handleLogin(): Promise<void> {
    this.isloading = true;
    await this.login();
    this.isloading = false;
    this.$router.push(`/person/${this.studentCode}`);
  }
  handleLogout(): void {
    this.logout();
  }
}
</script>

<style lang="stylus" scoped>

.bg {
  background-color: #252020;
}

.logo {
  max-width: 500px;
  padding: 2rem;
  margin: 0 auto;
}

.fb {
  color: white;
  background-color: #3b5998 !important;
  border-width: 0px 0px 2px 0px !important;
  border-color: #082b6f !important;
}

.fb.is-danger {
  background-color: ff3860 !important;
}

.button {
  &, &:hover, &:active {
    color: white;
  }
}
</style>
