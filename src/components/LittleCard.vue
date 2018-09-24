<template lang="pug">
a(:href='info.link')
  div.card.chula-nw(style='max-width: 300px; cursor: pointer; color: black')
    div.card-image(style='max-height: 300px; overflow: hidden')
      figure.image
        img(:src='info.image')
    div.card-content
      div.media
        div.media-left
          figure.image.is-48x48
            img(:src="info.icon" alt="Placeholder image")
        div.media-content(style='white-space: normal')
          p.title.is-4 {{info.name}}
          p.subtitle.is-6 {{info.desc}}    
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["value"],
  computed: {
    info() {
      let rs: any = this.value;
      rs.name = rs.name || "No Title";
      rs.desc = rs.desc || "No Description";
      rs.icon = rs.icon || "https://bulma.io/images/placeholders/96x96.png";
      rs.image =
        rs.image || "http://files.unigang.com/content/uploads/pic/7/2745.jpg";
      return rs;
    }
  }
});
</script>

<style lang="stylus" scoped>
.card-image .image img {
  object-fit: cover;
  width: 300px;
  height: 300px;
}
p.title {
  color: #363636 !important
}
p.subtitle {
  color: rgba(54,54,54,.9) !important
}
</style>
