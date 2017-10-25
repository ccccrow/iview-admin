<template>
  <div>
    <Form :model="searchform" :label-width="80" inline ref="searchform">
      <Card>
    <Row >
      <Col span="24">
        <FormItem label="用户名" prop="username">
            <Input v-model="searchform.username"></Input>
        </FormItem>
        <FormItem label="姓名" prop="realname">
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
import Mixin from "../../libs/mixinlist";
export default {
  mixins: [Mixin],
  data() {
    return {
      module: "user",
      name: "sysedit_user",
      chname: "用户",
      searchform: {
        username: "",
        realname: ""
      },
      statusname: ["失效", "正常"],
      columns: [
        {
          title: "用户名",
          key: "username"
        },
        {
          title: "姓名",
          key: "realname"
        },
        {
          title: "角色",
          key: "rolename"
        },
        {
          title: "机构",
          key: "orgname"
        },
        {
          title: "手机号码",
          key: "mobile"
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

