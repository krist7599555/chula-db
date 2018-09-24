<template lang="pug">
div
  NAVIGATE
  section.section
    div.field
      button.button.is-link(@click='$router.go(-1)') Back
    div.box.table__wrapper.chula-nw(v-if='sheet')
      div.field.has-addons
        div.control.is-expanded
          input.input.chula-nw(v-model='tableSearch' placeholder='Search...')
        div.control 
          button.button.is-link(disabled) {{tableDataFilter.length}}
      div
        b-table.is-size-7(
          :data="tableDataFilter"
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
            template(v-for='atr in tableColumn')
              b-table-column(:field="atr.field" :label="atr.label" sortable) 
                | {{ props.row[atr.field] }}
      hr/
    div.box(v-else)
      SPINNER
  FOOTER
</template>

<script>
import {
  get_sheetdata,
  get_sheetinfo,
  spreadsheetId,
  submit_form,
  submit_respond
} from "@/other/gsheet_api";

export default {
  data() {
    return {
      raw_sheet: {},
      selected: {},
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: "asc",
      currentPage: 1,
      perPage: 20,
      tableSearch: ""
    };
  },
  async created() {
    this.raw_sheet = await get_sheetdata(spreadsheetId);
  },
  methods: {
    submitForm() {
      submit_respond();
    }
  },
  computed: {
    sheet() {
      let res = _.get(this, "raw_sheet.data.values");
      console.log(res);
      if (res) {
        let maxsize = _.max(_.map(res, "length"));
        res.forEach(row => {
          row.length = maxsize;
        });
      }
      return res;
    },
    tableData() {
      let head = this.sheet[0];
      let body = this.sheet.slice(1);
      return body.map(record => {
        return _.zipObject(head, record);
      });
    },
    tableDataFilter() {
      let regex = RegExp(this.tableSearch);
      return this.tableData.filter(obj =>
        _.some(_.values(obj), str => regex.test(str))
      );
    },
    tableColumn() {
      let head = this.sheet[0];
      return head.map(name => {
        return {
          field: name,
          label: name
        };
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.section {
  @media screen and (max-width: 768px){
    padding: 3.5rem 1rem;
  }
}
.table__wrapper {
  overflow: scroll
  padding: 1rem;
  @media screen and (max-width: 768px){
    padding: 1rem .3rem;
  }
  background-color white;
}
>>> .table tr.is-selected {
  background-color: #FA7C91
}
th, td {
  max-width: 500px;
  overflow scroll
  white-space: nowrap;
}
</style>
