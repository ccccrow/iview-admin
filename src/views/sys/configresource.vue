<template>
  <Card>
      <Row>
        <Col span="24" id="tree" class="ztree">

        </Col>
        <Col span="24">
            <Button type="primary" @click.native="saveConfig">保存</Button>
  <Button type="ghost" @click.native="cancel" style="margin-left:15px;">取消</Button>
        </Col>
      </Row>
  </Card>
</template>
<script>
import Bus from "../../libs/bus.js";
import {finishEdit} from "../../libs/common"
import "../../../static/css/metroStyle/metroStyle.css";
import "../../../static/js/jquery-1.9.1.min";
import "../../../static/js/jquery.ztree.all.min";
export default {
  created() {
    this.roleid = this.$route.params.id;
    this.querytree(this.roleid);
  },
  methods: {
    cancel(){
      finishEdit(this,'sysresource_role');
    },
    saveConfig() {
      this.$http
        .post( "role/config", {
          resourceid: this.resourceid,
          roleid: this.roleid
        })
        .then(response => {
          var c = response.data.h.c;
          if (c == "0") {
            this.$Message.success(response.data.h.m);
            finishEdit(this,'sysresource_role','sys_role');
          } else {
            this.$Message.error(response.data.h.m);
          }
        });
    },
    queryresource(id) {
      this.$http
        .post("role/resource", { id: id })
        .then(response => {
          var data = response.data.b;
          data.forEach(function(value, index, array) {
            var treeObj = $.fn.zTree.getZTreeObj("tree");
            var node = treeObj.getNodeByParam("id", value.resourceid, null);
            treeObj.checkNode(node, true, false, true);
          });
        });
    },
    querytree(id) {
      this.$http.post("resource/tree").then(response => {
        console.log(response.data)
        var treeObj = $.fn.zTree.init($("#tree"), this.setting, response.data);
        treeObj.expandAll(true);
        this.queryresource(id);
      });
    },
    onCheck(e, treeId, treeNode) {
      this.resourceid = "";
      var zTree = $.fn.zTree.getZTreeObj("tree"),
        nodes = zTree.getCheckedNodes(true);
      for (var i = 0, l = nodes.length; i < l; i++) {
        this.resourceid += nodes[i].id + ",";
      }
    }
  },
  data() {
    return {
      resourceid: "",
      roleid: "",
      prename: "sys_role",
      setting: {
        check: {
          enable: true,
          chkboxType: { Y: "", N: "" }
        },
        view: {
          dblClickExpand: false
        },
        data: {
          key: { name: "resourcename", icon: "" },
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "parentid",
            rootPId: 0
          }
        },
        callback: {
          onCheck: this.onCheck
        }
      }
    };
  }
};
</script>
