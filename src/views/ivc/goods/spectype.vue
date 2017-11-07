<template>
  <div>
    <Form :model="searchform" :label-width="80" inline ref="searchform">
      <Card>
    <Row >
      <Col span="24">
        <Button type="primary" icon="android-add" @click.native="addSpectype">新增</Button>
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
export default {
  mixins: [Mixin],
  created() {
    this.searchform.specid = this.$route.params.specid;
  },
  methods: {
    addSpectype(){
      this.edit({
        "id": "new",
        "specid": this.searchform.specid
      })
    }
  },
  data() {
    return {
      module: "ivc/specType",
      name: "ivcedit_spectype",
      chname: "规格",
      statusname: ["停用", "启用"],
      searchform: {
        specid:0
      },
      columns: [
        {
          title: "id",
          key: "id"
        },
        {
          title: "名称",
          key: "spectypename"
        },
        {
          title: "排序",
          key: "seq"
        },
        {
          title: "状态",
          key: "spectypestatus",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.status == 1 ? "red" : "blue"
                }
              },
              this.statusname[params.row.spectypestatus]
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
          width: 200,
          render: this.renderop
        }
      ]
    };
  }
};
</script>

