<template>
  <div>
    <Form :model="searchform" :label-width="80" inline ref="searchform">
      <Card>
    <Row >
      <Col span="4">
        <div id="dicttree" class="ztree"></div>
      </Col>
      <Col span="20">
        <Button type="primary" icon="android-add" @click.native="add()">新增</Button>
        <Table :columns="columns" :data="tableData" stripe style="margin-top:5px;"></Table>
        <Card style="margin-top:5px;text-align:right;">
        <Page :total="total" show-total show-sizer :page-size="pagesize" :current="currentpage" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
     </Card> 
      </Col>
    </Row>
    </Card>
    </Form>
    
  </div>  
</template>
<script>
import Mixin from "../../libs/mixinlist";
import "../../../static/css/metroStyle/metroStyle.css";
import "../../../static/js/jquery-1.9.1.min";
import "../../../static/js/jquery.ztree.all.min";
export default {
  mixins: [Mixin],
  data() {
    return {
      module: "dict",
      chname: "字典",
      name: "sysedit_dict",
      searchform: {
        parentid:0
      },
      setting: {
        async: {
          enable: true,
          url:  "http://localhost:8091/dict/tree",
          autoParam: ["id"]
        },
        data: {
          key: { name: 'name' },
          simpleData: { enable: true, idKey: "id", pIdKey: "parentid", rootPId: 0 }
        },
        callback: {
          onClick: this.clickTree
        }
      },
      columns: [
        {
          title: "id",
          key: "id"
        },
        {
          title: "字典名称",
          key: "name"
        },{
          title: "字典编码",
          key: "code"
        },{
          title: "字典值",
          key: "value"
        },
        {
          title: "操作",
          width: 140,
          render: this.renderop
        }
      ]
    };
  },
  methods: {
    clickTree(event, treeId, treeNode, clickFlag) {
      this.searchform.parentid = treeNode.id;
      this.getData();
    },
    getDataCallback(){
      this.asyncTree();
    },
    deleteCallback(){
      this.asyncTree();
    },
    add(){
      this.edit({"parentid":this.searchform.parentid,"id":"new"})
    },
    asyncTree() {
      var treeObj = $.fn.zTree.getZTreeObj("dicttree");
      var nodes = treeObj.getSelectedNodes();
      if (nodes.length > 0) {
        nodes[0].isParent = true;
        treeObj.reAsyncChildNodes(nodes[0], "refresh");
      } else {
        treeObj.reAsyncChildNodes(null, "refresh");
      }
    }
  },
  mounted () {
    $.fn.zTree.init($("#dicttree"), this.setting);
  }
};
</script>

