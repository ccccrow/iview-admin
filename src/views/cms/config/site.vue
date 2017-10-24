<template>
<Row>
  <Col span="5">
  <Card>
  </Card>
  </Col>
  <Col span="19">
        <Button type="primary" icon="android-add" @click.native="add()" style="margin-left:5px;">新增</Button>
    <Table :columns="columns" :data="tableData" stripe style="margin-left:5px;margin-top:5px;"></Table> 
    <Card style="margin-top:5px;margin-left:5px;text-align:right;">
        <Page :total="total" show-total show-sizer :page-size="pagesize" :current="currentpage" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
     </Card>
  </Col>
  </Row>
</template>

<script>
import Mixin from "../../../libs/mixinlist";
export default {
  mixins: [Mixin],
  data() {
    return {
      module: "cms/site",
      name: "cmsedit_site",
      chname:"站点",
      statusname: ['无效','有效'],
      searchform: {
      },
      columns: [
        {
          title: "站点名称",
          key: "sitename"
        },
        {
          title: "站点简称",
          key: "sitesimple"
        },
        {
          title: "域名",
          key: "domain"
        },
        {
          title: "访问路径",
          key: "visitpath"
        },
        {
          title: "是否静态",
          key: "isstatic"
        },
        {
          title: "状态",
          key: "status",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.status == 1 ? "red" : "blue"
                }
              },
              this.statusname[params.row.status]
            );
          }
        },
        {
          title: "操作",
          width:200,
          render: this.renderop
        }
      ]
    };
  }
};
</script>
