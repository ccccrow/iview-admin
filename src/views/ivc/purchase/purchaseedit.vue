<template><div>
  <Card>
  <Form :model="form" :label-width="120" :rules="rules" ref="form" style="width:98%;">
    <Row>
      <Col span="6">
    <Form-item label="供应商" prop="supplierid">
      <Select v-model="form.supplierid" >
        <Option v-for="item in supplierList" :value="item.id" :key="item.id">{{ item.suppliername }}</Option>
    </Select>
    </Form-item>
    </Col>
    <Col span="6">
    <Form-item label="仓库" prop="storeid">
      <Select v-model="form.storeid" >
        <Option v-for="item in storeList" :value="item.id" :key="item.id">{{ item.storename }}</Option>
    </Select>
    </Form-item>
    </Col>
      <Col span="6">
    <Form-item label="结算账户" prop="accountid">
      <Select v-model="form.accountid">
        <Option v-for="item in accountList" :value="item.id" :key="item.id">{{ item.accountname }}</Option>
    </Select>
    </Form-item>
    </Col>
    <Col span="6">
    <Form-item label="实付金额" prop="money">
      <Input v-model="form.money"></Input>
    </Form-item>
    </Col>
    </Row>
    <Row>
      <Col span="6">
    <Form-item label="日期" prop="purchasedate">
       <DatePicker type="date" placeholder="选择日期" v-model="form.purchasedate"></DatePicker>
    </Form-item>
    </Col>
    <Col span="18">
    <Form-item label="备注" prop="remark">
      <Input v-model="form.remark" type="textarea"></Input>
    </Form-item>
    </Col>
    </Row>
    <Row>
      <Col span="24">
        <Button type="primary" @click.native="showgoods">添加条目</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24" style="margin-top:10px;">
      <Table :columns="columns" :data="tableData" stripe></Table> 
      </Col>
    </Row>
    <Row>
      <Col span="24" style="text-align:left;margin-top:10px;">
    <Form-item>
  <Button type="primary" @click.native="submitData" :loading="save_loading">草稿</Button>
  <Button type="primary" @click.native="submitData" :loading="save_loading" style="margin-left:15px;">采购</Button>
  <Button type="ghost" @click.native="finishEdit()" style="margin-left:15px;">取消</Button>
    </Form-item>
     </Col>
    </Row>
  </Form>
  </Card>
   <Modal
        v-model="goodsmodal"
        title="添加条目">
        <Table :columns="goodscolumns" :data="goodsTableData" stripe></Table>
        <p slot="footer"></p> 
    </Modal>

    <Modal
        v-model="goodslistmodal"
        title="11">
    </Modal>
  </div>
</template>
<script>
import Mixin from "../../../libs/mixindata";
import Bus from "../../../libs/bus";
export default {
  mixins: [Mixin],
  methods: {
    showgoods() {
      this.goodsmodal = true;
    },
    queryGoods(){
      this.$http.post("ivc/goods/query/list", {}).then(response => {
        let o = response.data.b;
        this.goodsTableData = o;
      });
    },
    querySupplier() {
      this.$http.post("ivc/supplier/query/list", {}).then(response => {
        let o = response.data.b;
        this.supplierList = o;
      });
    },
    queryStore() {
      this.$http.post("ivc/store/query/list", {}).then(response => {
        let o = response.data.b;
        this.storeList = o;
      });
    },
    queryAccount() {
      this.$http.post("ivc/account/query/list", {}).then(response => {
        let o = response.data.b;
        this.accountList = o;
      });
    },
    selectgoods(id){
      this.goodslistmodal = true;
    }
  },
  mounted() {
    this.querySupplier();
    this.queryStore();
    this.queryAccount();
    this.queryGoods();
  },
  data() {
    return {
      goodsmodal: false,
      goodslistmodal: false,
      goodscolumns: [
        {
          title: "名称",
          key: "goodsname"
        },
        {
          title: "货号",
          key: "goodsno"
        },
        {
          title: "选择",
          key: "action",
          render: (h, params) => {
            return h(
              "Button",
              {
                style: {
                  marginLeft: "10px"
                },
                props: {
                  type: "primary",
                  size: "small"
                },
                on: {
                  click: e => {
                    let currentRowData = this.goodsTableData[params.index];
                    this.selectgoods(currentRowData.id);
                  }
                }
              },
              "选择"
            );
          }
        }
      ],
      goodsTableData: [],
      columns: [
        {
          title: "商品",
          key: "goodsid"
        },
        {
          title: "货号",
          key: "goodsno"
        },
        {
          title: "规格",
          key: "specs"
        },
        {
          title: "数量",
          key: "goodscount"
        },
        {
          title: "单价",
          key: "purchaseprice"
        },
        {
          title: "折扣",
          key: "rebate"
        },
        {
          title: "折扣价",
          key: "rebateprice"
        }
      ],
      tableData: [],
      form: {
        supplierid: 0,
        storeid: 0,
        accountid: 0,
        money: 0,
        purchasedate: "",
        id: "",
        remark: ""
      },
      supplierList: [],
      storeList: [],
      accountList: [],
      prename: "ivc_purchase",
      name: "ivcedit_purchase",
      module: "ivc/purchase",
      rules: {
        supplierid: [{ required: true, message: "请选择供应商", trigger: "blur" }]
      }
    };
  }
};
</script>
