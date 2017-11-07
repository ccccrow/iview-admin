<template>
  <div>
    <Form :model="searchform" :label-width="80" inline ref="searchform">
      <Card>
    <Row >
      <Col span="24">
        <FormItem label="名称" prop="storename">
            <Input v-model="searchform.storename"></Input>
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
export default {
  mixins: [Mixin],
  data() {
    return {
      module: "ivc/supplier",
      name: "ivcedit_supplier",
      chname: "供应商",
      statusname: ["停用", "启用"],
      searchform: {
        storename: ""
      },
      columns: [
        {
          title: "id",
          key: "id"
        },
        {
          title: "名称",
          key: "suppliername"
        },
        {
          title: "负责人",
          key: "chargename"
        },
        {
          title: "地址",
          key: "address"
        },
        {
          title: "电话",
          key: "mobile"
        },
        {
          title: "备注",
          key: "remark"
        },
        {
          title: "排序",
          key: "seq"
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

