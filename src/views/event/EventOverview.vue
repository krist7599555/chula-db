<template lang="pug">
div
  NAVIGATE
  section.section
    div.field
      button.button.is-link(@click='$router.go(-1)') Back
    div.box.table__wrapper.chula-nw(v-if='!loading')
      div.field.has-addons
        div.control.is-expanded
          input.input.chula-nw(v-model='tableSearch' placeholder='Search...')
        div.control 
          button.button.is-link(disabled) {{sheetFilter.length}}
      div
        b-table.is-size-7(
          :data="sheetFilter"
          :selected.sync="selected"
          :focusable='false'
          :paginated="isPaginated"
          :per-page="perPage"
          :current-page.sync="currentPage"
          :pagination-simple="isPaginationSimple"
          :default-sort-direction="defaultSortDirection"
          default-sort="เลขนิสิต"
          :mobile-cards='false'
        )
          template(slot-scope="props")
            template(v-for='atr in sheetColumn')
              b-table-column(:field="atr.field" :label="atr.label" sortable) 
                | {{ props.row[atr.field] }}
    div.box(v-else)
      SPINNER
  FOOTER
</template>

<script>
export default {
  data() {
    return {
      sheet: [{}],
      selected: {},
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: "asc",
      currentPage: 1,
      perPage: 100,
      tableSearch: "",
      loading: true
    };
  },
  async created() {
    // [{a: , b: }, {a:, b:}, {a:, b:}]
    this.sheet = await this.$store.getters.eventRecords(this.paramId);
    this.loading = false;
  },
  computed: {
    paramId() {
      return this.$route.params.id;
    },
    sheetFilter() {
      let regex = RegExp(this.tableSearch);
      return this.sheet.filter(obj =>
        _.some(_.values(obj), str => regex.test(str))
      );
    },
    sheetColumn() {
      let head = _.uniq(_.concat(..._.map(this.sheet, _.keys)));
      return head.map(name => ({ field: name, label: name }));
    }
  }
};
</script>

<style lang="stylus" scoped>
.section {
  @media screen and (max-width: 768px) {
    padding: 3.5rem 1rem;
  }
}

.table__wrapper {
  overflow: scroll;
  padding: 1rem;

  @media screen and (max-width: 768px) {
    padding: 1rem 0.3rem;
  }

  background-color: white;
}

>>> .table tr.is-selected {
  background-color: #FA7C91;
}

th, td {
  max-width: 500px;
  overflow: scroll;
  white-space: nowrap;
}
</style>
