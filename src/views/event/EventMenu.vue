<template lang='pug'>
div
  NAVIGATE
  div.section.bg.chula-nw(align='center')
    div.hero
      div.hero-body
        p.has-text-white.is-size-1.fbold EVENT

    div.card(@click='$router.push("/event/graduation")')
      div.card-image
        figure
          img(src='http://files.unigang.com/content/uploads/pic/7/2745.jpg')
      div.card-content
        div.media
          div.media-left
            figure
              img.icon(src='https://scontent.fbkk4-2.fna.fbcdn.net/v/t1.0-9/41399569_1925711710805490_4016974137607061504_o.png?_nc_cat=0&_nc_eui2=AeHCgPwliBmNwtq7o_oB0MgLG7dbZYKnmSKcWSm0LoR3yq80jrgoHkJMFi71F1gqKpNEK2oaf9xzWslBCbU4hsPMWFt7hXXv_5vlZVchPpv9Vw&oh=05639bbaf9ac8e6dd3c8d1f9a7700ae6&oe=5C295889')
          div.media-content
            p.title รับปริญญา
            p.subtitle 11-12 ตุลาคม
    div(style='height: 4rem')
  FOOTER
</template>

<script lang="ts">
import { UPDATE_USER } from "@/store/actions.type";
import { Component, Vue } from "vue-property-decorator";
import Spinner from "@/components/Spinner.vue";
import GMapComp from "@/components/GoogleMap.vue";
import InputComp from "@/components/InputComponent.vue";

@Component({
  components: { Spinner, InputComp, GMapComp }
})
export default class EventMenu extends Vue {
  private e = require("@/other/dumpevent.json");
  private gmap: any = {};
  private data: object = {};
  private formValidate: any = require("@/other/formValidate.json").geolocation;

  // CYCLE HOOK
  async mounted() {
    this.data = await this.$store.getters.userInfo;
    this.gmap = this.$refs.gmap;
  }

  // COMPUTED
  get paramId(): string {
    return this.$route.params.id;
  }
}
</script>

<style lang="stylus" scoped>
.bg {
  background-image: linear-gradient(#209cee, #eaa) !important;
  // background-color: #902040;
  min-height: 100vh;
}

.icon {
  height: 80px;
  width: auto;
}

.card {
  max-width: 350px;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  transition-duration: 0.2s;

  &:hover {
    transform: scale(1.05);
  }
}

.box {
  max-width: 600px;

  & {
    padding-left: 0;
    padding-right: 0;
    paddind-bottom: 0;
  }
}

.field-label .label {
  @media screen and (max-width: 768px) {
    text-align: left;
  }
}
</style>
