<template>
  <div>
    <Form :model="searchform" :label-width="80" inline ref="searchform">
      <Card>
    <Row >
      <Col span="24">
        <FormItem label="姓名" prop="realname">
            <Input v-model="searchform.realname"></Input>
        </FormItem>
        <FormItem label="手机号" prop="mobile">
            <Input v-model="searchform.mobile"></Input>
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
      module: "ivc/member",
      name: "ivcedit_member",
      chname: "会员",
      searchform: {
        realname: "",
        mobile: ""
      },
      columns: [
        {
          title: "id",
          key: "id"
        },
        {
          title: "姓名",
          key: "realname"
        },
        {
          title: "手机号码",
          key: "mobile"
        },
        {
          title: "创建时间",
          key: "createtime",
          width: 200
        },
        {
          title: "操作",
          width: 250,
          render: this.renderop
        }
      ]
    };
  }
};
</script>

