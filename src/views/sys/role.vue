<template>
  <div>
    <Form :model="searchform" :label-width="80" inline ref="searchform">
      <Card>
    <Row >
      <Col span="24">
        <FormItem label="角色名称" prop="rolename">
            <Input v-model="searchform.rolename"></Input>
        </FormItem>
        <Button type="primary" icon="ios-search" @click.native="tablesearch">查询</Button>
        <Button type="primary" icon="refresh" @click.native="resetForm('searchform')">重置</Button>
        <Button type="primary" icon="android-add" @click.native="add()" v-if="checkroles('rolesave')">新增</Button>
      </Col>
    </Row>
    </Card>
    </Form>
    <Row style="margin-top:5px;">
      <Col span="24">
        <Table :columns="columns" :data="tableData" stripe></Table> 
      </Col>
    </Row> 
    <Card style="margin-top:5px;text-align:right;">
        <Page :total="total" show-total show-sizer :page-size="pagesize" :current="currentpage" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
     </Card>
  </div>  
</template>
<script>
import Mixin from "../../libs/mixinlist";
import util from "../../libs/util";
export default {
  mixins: [Mixin],
  data() {
    return {
      module: "role",
      name: "sysedit_role",
      chname: "角色",
      searchform: {
        rolename: ""
      },
      columns: [
        {
          title: "角色名称",
          key: "rolename"
        },
        {
          title: "角色代码",
          key: "rolecode"
        },
        {
          title: "角色描述",
          key: "roledesc"
        },
        {
          title: "创建时间",
          width:200,
          key: "createtime"
        },
        {
          title: "操作",
          width:300,
          render: (h, params) => {
            let currentRowData = this.tableData[params.index];
            let op = this.renderop(h,params);
            let vm = this;
            op.children.push(h("Button",
                {
                  style:{
                    marginLeft: "10px"
                  },
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: e => {
                      vm.configresource({ id: currentRowData.id });
                    }
                  }
                },
                "配置权限"
              ));
              op.children.push(h("Button",
                {
                  style:{
                    marginLeft: "10px"
                  },
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: e => {
                      vm.configuser({ id: currentRowData.id });
                    }
                  }
                },
                "配置用户"
              ));
              return op;
          }
        }
      ]
    };
  },
  methods: {
    configresource(params) {
      params.title = "配置资源"
      util.openNewPage(this, "sysresource_role", params);
      this.$router.push({
        name: "sysresource_role",
        params:params});
    },
    configuser(params) {
      params.title = "配置用户"
      util.openNewPage(this, "sysuser_role", params);
      this.$router.push({
        name: "sysuser_role",
        params:params});
    }
  }
};
</script>

