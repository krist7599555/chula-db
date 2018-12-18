<template lang="pug">
.section.hero.is-fullheight
  .box
    .content
      h1 hello
      a(:href='login') {{login}}
      //- iframe(:src='login' width=900 height=900)
      //- iframe(:src='login2')
</template>

<script>
import { getToken, verifyToken } from "../../sso.js";
export default {
  data() {
    return {
      ticket: "",
      login: "loading"
      // login: 'https://account.it.chula.ac.th/login?service=https://chula.ml',
      // login2: 'https://account.it.chula.ac.th/login',
    };
  },
  created() {
    console.log(this.$route.query);
    getToken("6031301721", "krist7599555")
      .then(({ ticket, content }) => {
        this.login = content;
        this.ticket = ticket;
        console.log("ticket", ticket);
        return verifyToken(ticket);
      })
      .then(result => {
        console.log(result);
      });
  },
  computed: {
    query() {
      return "";
    }
  }
};
</script>
