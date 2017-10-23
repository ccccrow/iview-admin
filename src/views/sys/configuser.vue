<template>
  <Card>
      <Row>
        <Col span="24"
                style="margin-left:10px;">
                <Transfer :data="nouserlist" 
                :target-keys="userlist"
                filterable
                :list-style="listStyle"
                :filter-method="filterMethod" @on-change="handleChange"></Transfer>
        </Col>
        <Col span="24" style="text-align:center;margin-top:10px;">
            <Button type="primary" @click.native="saveUser">保存</Button>
            <Button type="ghost" @click.native="cancel" style="margin-left:15px;">取消</Button>
        </Col>
      </Row>
  </Card>
</template>
<script>
import {finishEdit} from "../../libs/common"
export default {
  created() {},
  mounted() {
    this.roleid = this.$route.params.id;
    var _this = this;
    this.remoteMethod().then(function() {
      _this.queryExistsUser();
    });
  },
  methods: {
    cancel(){
      finishEdit(this,'sysuser_role');
    },
    orgClick(obj, node) {
      this.orgid = node.data.value;
    },
    filterMethod(item, query) {
      return item.label.indexOf(query) > -1;
    },
    handleChange(newTargetKeys) {
      this.userlist = newTargetKeys;
    },
    saveUser() {
      let userid = "";
      for (var i in this.userlist) {
        userid = userid + "," + this.userlist[i];
      }
      userid = userid.substring(1);
      this.$http
        .post("role/configuser", {
          userid: userid,
          roleid: this.roleid
        })
        .then(response => {
          var c = response.data.h.c;
          if (c == "0") {
            this.$Message.success(response.data.h.m);
            finishEdit(this,'sysuser_role');
          } else {
            this.$Message.error(response.data.h.m);
          }
        });
    },
    remoteMethod() {
      var vm = this;
      var promise = new Promise(function(resolve, reject) {
        vm.$http
          .post("user/query/list", {
            orgid: vm.orgid
          })
          .then(response => {
            vm.nouserlist = response.data.b.map(item => {
              return {
                key: item.id,
                label: item.realname,
                orgid: item.orgid,
                disabled: false
              };
            });
            resolve();
          });
      });
      return promise;
    },
    queryExistsUser() {
      var vm = this;
      vm.$http
        .post("role/user", {
          id: this.roleid ? this.roleid : ""
        })
        .then(response => {
          vm.userlist = response.data.b.map(item => {
            return item.id;
          });
        });
    }
  },
  data() {
    return {
      listStyle: {
        width: "45%",
        height: "400px"
      },
      userlist: [],
      list: [],
      nouserlist: [],
      roleid: "",
      orgid: "",
      org: []
    };
  }
};
</script>
