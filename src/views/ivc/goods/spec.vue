<template>
  <div>
    <Form :model="searchform" :label-width="80" inline ref="searchform">
      <Card>
    <Row >
      <Col span="24">
        <FormItem label="规格名称" prop="specname">
            <Input v-model="searchform.specname"></Input>
        </FormItem>
        <Button type="primary" icon="ios-search" @click.native="tablesearch">查询</Button>
        <Button type="primary" icon="refresh" @click.native="resetForm('searchform')">重置</Button>
        <Button type="primary" icon="android-add" @click.native="add()">新增</Button>
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
import Mixin from "../../../libs/mixinlist";
import util from "../../../libs/util";
export default {
  mixins: [Mixin],
  data() {
    return {
      module: "ivc/spec",
      name: "ivcedit_spec",
      chname: "规格",
      statusname: ["停用", "启用"],
      searchform: {
        specname: ""
      },
      columns: [
        {
          title: "id",
          key: "id"
        },
        {
          title: "规格名称",
          key: "specname"
        },
        {
          title: "规格数",
          key: "speccount"
        },
        {
          title: "排序",
          key: "seq"
        },
        {
          title: "状态",
          key: "specstatus",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.status == 1 ? "red" : "blue"
                }
              },
              this.statusname[params.row.specstatus]
            );
          }
        },
        {
          title: "创建时间",
          key: "createtime",
          width: 200
        },
        {
          title: "操作",
          width: 250,
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
                     vm.configspectype({ specid: currentRowData.id });
                    }
                  }
                },
                "规格管理"
              ));
              return op;
          }
        }
      ]
    };
  },
  methods: {
    configspectype(params) {
      params.title = "规格详情"
      util.openNewPage(this, "ivcspec_type", params);
      this.$router.push({
        name: "ivcspec_type",
        params:params});
    },
  }
};
</script>

