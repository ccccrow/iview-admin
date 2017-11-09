<template>
  <div>
    <Form :model="searchform" :label-width="80" inline ref="searchform">
      <Card>
    <Row >
      <Col span="24">
        <Button type="primary" icon="ios-search" @click.native="tablesearch">查询</Button>
        <Button type="primary" icon="refresh" @click.native="resetForm('searchform')">重置</Button>
        <Button type="primary" icon="android-add" @click.native="add()">添加零售单</Button>
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
import {
  editButton
} from "./../../../libs/common"
export default {
  mixins: [Mixin],
  data() {
    return {
      module: "ivc/sales",
      name: "ivcedit_sales",
      chname: "零售单",
      searchform: {},
      columns: [
        {
          title: "id",
          key: "id"
        },
        {
          title: "收款金额",
          key: "money",
          render: (h, params) => {
            return h("span", {}, params.row.money / 100);
          }
        },
        {
          title: "会员手机号",
          key: "mobile"
        },
        {
          title: "备注",
          key: "remark"
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
            let op = [];
            //if (this.checkroles(this.module + "save")) {
            op.push(editButton(this, h, currentRowData, params.index,"查看"));
            //}
            return h("div", op);
          }
        }
      ]
    };
  },
  methods: {}
};
</script>

