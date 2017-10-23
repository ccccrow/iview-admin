/**
 * Created by yk on 2017/2/13.
 */
import Bus from "./bus.js";
import {editButton,deleteButton} from "./common"
import util from "./util.js";
export default {
  data() {
    return {
      total: 0,
      tableData: [],
      currentpage: 1,
      pagesize: 10
    }
  },
  created() {
    Bus.$on(this.getDataValue, () => {
      this.getData(this.getDataCallback);
    });
  },
  computed: {
    pageTagsList() {
      return this.$store.state.pageOpenedList; // 打开的页面的页面对象
    },
    getDataValue() {
      return 'get' + this.module
    },
    deleteaction() {
      return this.module + "/delete"
    },
    listaction() {
      return this.module + "/query"
    }
  },
  mounted: function () {
    this.getData();
  },
  methods: {
    checkroles(sr){
      var r = sessionStorage.getItem("r");
     if (r && r.indexOf(sr) != -1) {
       return true;
     } else {
       return false;
     }
   },
    renderop(h, params) {
      let currentRowData = this.tableData[params.index];
      let op = [];
      if(this.checkroles(this.module+"save")){
        op.push(editButton(this, h, currentRowData, params.index))
      }
      if(this.checkroles(this.module+"delete")){
        op.push(deleteButton(this, h, currentRowData, params.index))
      }
      return h('div', op)
    },
    add(){
      this.edit({"id":"new"})
    },
    edit(params,title) {
      if(!title){
        title = (params.id==="new"?"新增":"编辑")+this.chname;
      }
      params.title = title;
      util.openNewPage(this, this.name,params);
      this.$router.push({
        name: this.name,
        params:params});
    },
    resetForm(name) {
      this.$refs[name].resetFields();
      this.getData();
    },
    getUser() {
      return JSON.parse(sessionStorage.getItem("user"))
    },
    checkroles(sr) {
      var r = sessionStorage.getItem("r");
      if (r && r.indexOf(sr) != -1) {
        return true;
      } else {
        return false;
      }
    },
    tablesearch: function () {
      this.currentpage = 1;
      this.getData();
    },
    pageSizeChange: function (pagesize) {
      this.pagesize = pagesize;
      this.currentpage = 1;
      this.getData();
    },
    pageChange: function (currentpage) {
      this.currentpage = currentpage;
      this.getData();
    },
    getDictData: function (code, callback) {
      this.$http.post('dict/query/code', {
          code: code
        })
        .then((response) => {
          if (callback) callback(response.data.b.data);
        })
    },
    getData: function (callback) {
      var vm = this;
      this.loading = true;
      vm.$http.post(vm.listaction, Object.assign({
          "curPage": vm.currentpage,
          "pageSize": vm.pagesize
        }, vm.searchform))
        .then((response) => {
          vm.tableData = response.data.b.data;
          vm.total = response.data.b.total;
          vm.loading = false;
          if (typeof (callback) == "function") callback(response.data.b.data);
        })
    },
    deleteData: function (id) {
      var _this = this;
      this.$http.post(this.deleteaction, {
          "id": id
        })
        .then((response) => {
          if (response.data.h.c == "0") {
            _this.$Message.success('删除成功!');
            _this.getData();
            if(_this.deleteCallback){
              _this.deleteCallback();
            }
          } else {
            _this.$Message.error(response.data.h.m);
          }
        })
    }
  }
}