<template>
  <div>
    <Form :model="searchform" :label-width="80" inline ref="searchform">
      <Card>
    <Row >
      <Col span="24">
        <FormItem label="商品" prop="goodsname">
            <Input v-model="searchform.goodsname"></Input>
        </FormItem>
        <FormItem label="分类" prop="realname">
            <Input v-model="searchform.realname"></Input>
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
      module: "ivc/goods",
      name: "ivcedit_goods",
      chname: "商品",
      searchform: {
        goodsname: "",
        goodstype: ""
      },
      statusname: ["停用","启用"],
      columns: [
        {
          title: "id",
          key: "id",
          width:100
        },
        {
          title: "名称",
          key: "goodsname",
          width:100
        },
        {
          title: "货号",
          key: "goodsno",
          width:100
        },
        {
          title: "品牌",
          key: "brandname",
          width:100
        },
        {
          title: "分类",
          key: "goodstypename",
          width:100
        },
        {
          title: "规格",
          key: "specs",
          width: 200,
        },
        {
          title: "建议零售价",
          key: "sgretailprice",
          width:100
        },
        {
          title: "状态",
          key: "status",
          width:100,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.status == 0 ? "red" : "blue"
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
          fixed: 'right',
          render: this.renderop
        }
      ]
    };
  }
};
</script>

