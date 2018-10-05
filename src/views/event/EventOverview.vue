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
      div(v-if='sheetFilter')
        b-table.is-size-7(
          :data="sheetFilter"
          :colums="sheetColumns"
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
            b-table-column(field="stat" label="stat" sortable) 
              button.button.is-info.is-loading(v-if='props.row.stat == "waiting"')
              button.button.is-success(v-else-if='props.row.stat') OK
              button.button.is-danger(v-else @click='updateUser(props.row)') NOPE
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
      perPage: 200,
      tableSearch: "",
      loading: true
    };
  },
  async created() {
    // [{a: , b: }, {a:, b:}, {a:, b:}]
    this.sheet = await this.$store.getters.eventRecords(this.paramId);
    this.loading = false;
  },
  methods: {
    updateUser(usr) {
      console.log(usr);
      this.sheet = this.sheet.map(obj => {
        if (obj.STUDENTCODE == usr.STUDENTCODE) obj.stat = "waiting";
        return obj;
      });
      this.$forceUpdate();
      // this.loading_list.push(usr.STUDENTCODE);
      this.$store
        .dispatch("checkIn", {
          event: "graduation",
          studentCode: usr.STUDENTCODE
        })
        .then(res => {
          if (res.success) {
            this.sheet = this.sheet.map(obj => {
              if (obj.STUDENTCODE == usr.STUDENTCODE) obj.stat = "000000000";
              return obj;
            });
          }
          this.$forceUpdate();
        });
    }
  },
  computed: {
    paramId() {
      return this.$route.params.id;
    },
    sheetFilter() {
      console.log("recomputed sheetfilter");
      let regex = RegExp(this.tableSearch);
      return this.sheet.filter(obj =>
        _.some(_.values(obj), str => regex.test(str))
      );
      // .map(val => {
      //   if (this.loading_list.includes(val.STUDENTCODE)) {
      //     val.stat = 'waiting';
      //   }
      //   return val;
      // });
    },
    sheetColumn() {
      let head = [
        "STUDENTCODE",
        "titleTH",
        "nameTH",
        "surnameTH",
        "nicknameTH",
        "faculty",
        "gender",
        "role",
        "tel",
        "stat",
        "line",
        "studentCode",
        "dormitory",
        "dormitoryBed",
        "dormitoryBuilding",
        "dormitoryRoom"
      ];
      // let head = _.uniq(_.concat(..._.map(this.sheet, _.keys)));
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
