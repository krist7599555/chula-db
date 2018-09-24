
<template lang='pug'>
  footer.footer
    div.content.has-text-left
      div.columns
        div.column.is-3
          figure.image.is-96x96(style='margin: 0; height: 80px')
            img(src='https://www.chula.ac.th/wp-content/themes/chulalongkorn/assets/images/logo-chula-sub-white-240x120.png')
          div
            p.
              #[strong.has-text-white Create ] by #[a Krist Pornpairin. ]
              #[br] #[strong.has-text-white Contact ] us #[a(href="tel:0900206430") 090-020-6430] 
        div.column
          div.field
            strong.has-text-white.is-size-5
              | INFORMATION
            div.has-text-white.field
              li event
              li sponcer
        div.column
          div.field
            strong.has-text-white.is-size-5
              | ABOUT #[a(href='https://www.chula.ac.th/en/') CHULA]
            div(style='margin-left: -2px')
              a: span.fa-stack
                i.fa.fa-square.fa-stack-2x
                i.fa.fa-facebook.fa-stack-1x.fa-inverse
              a: span.fa-stack
                i.fa.fa-square.fa-stack-2x
                i.fa.fa-twitter.fa-stack-1x.fa-inverse
              a: span.fa-stack
                i.fa.fa-square.fa-stack-2x
                i.fa.fa-instagram.fa-stack-1x.fa-inverse


          
        div.column.is-5
          div.field: strong.has-text-white.is-size-5
            | ABOUT #[a(href='https://web.facebook.com/sgcu.obj/') SGCU]
          div.columns
            div.column: div
              a.map(style='display: table' href='https://goo.gl/maps/cyzLJBvY1hH2')
                div(style="display:table-cell; vertical-align:middle;")
                  div.has-text-center.has-text-white View on Google Maps
            div.column
              p.chula-nw(style='font-size: .8rem').
                องค์การบริหารสโมสรนิสิตจุฬาลงกรณ์มหาวิทยาลัย (อบจ.) ชั้น 2 อาคาร จุลจักรพงษ์ แขวง ปทุมวัน เขต ปทุมวัน กรุงเทพมหานคร 10330
          //- img(src='https://www.library.eng.chula.ac.th/assets/1.0.0/img/map.jpg')

</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Getter, Action, Mutation, namespace } from "vuex-class";

@Component({
  components: {}
})
export default class Navigate extends Vue {}
</script>

<style lang="stylus" scoped>
footer >>> p {
  color: white;
}
a:hover {
    color: #FA7C91;
    font-weight: bold 
}
.footer {
    // padding-bottom: 3rem;
}
li {
  list-style-type: none;
}
// .fa {
//   color: white;
// }
// .fa.fa-inverse {
//   color: #363636;
// }

.map {
  background: -webkit-gradient(linear,left top,left bottom,from(rgba(0,0,0,.4)),to(rgba(0,0,0,.4))),url(https://www.library.eng.chula.ac.th/assets/1.0.0/img/map.jpg);
  background: linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)),url(https://www.library.eng.chula.ac.th/assets/1.0.0/img/map.jpg);
  background-position: 50%;
  background-size: cover;
  min-height: 85px;
  width: 100%;
  @media screen and (min-width 490px){
    width: 150px;
  }
  @media screen and (min-width 769px){
    width: 200px;
  }
  text-align: center;
  float: left;
  margin-bottom: 12px;
  border-radius: 4px;
  padding: 4px;
}
</style>
