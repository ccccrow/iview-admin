<template>
  <div>
    <Form :model="searchform" :label-width="80" inline ref="searchform">
      <Card>
    <Row >
      <Col span="24">
        <FormItem label="品牌名称" prop="brandname">
            <Input v-model="searchform.brandname"></Input>
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
      module: "ivc/brand",
      name: "ivcedit_brand",
      chname: "品牌",
      searchform: {
        brandname: ""
      },
      columns: [
        {
          title: "id",
          key: "id"
        },
        {
          title: "品牌",
          key: "brandname"
        },
        {
          title: "网址",
          key: "brandsite"
        },
        {
          title: "描述",
          key: "branddesc"
        },
        {
          title: "排序",
          key: "seq"
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

