<template>
  <div id="purchasePrint">
    <Card>
      <Form :model="form" :label-width="120" :rules="rules" ref="form" style="width:98%;">
        <Row>
          <Col span="6">
          <Form-item label="供应商" prop="supplierid">
            <Select v-model="form.supplierid">
              <Option v-for="item in supplierList" :value="item.id" :key="item.id">{{ item.suppliername }}</Option>
            </Select>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="仓库" prop="storeid">
            <Select v-model="form.storeid">
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
            <DatePicker type="date" placeholder="选择日期" format="yyyy-MM-dd" :value="purchasedate" @on-change="changedate"></DatePicker>
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
          <Button type="primary" @click.native="showgoods" v-if="form.status==0">添加条目</Button>
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
            <Button type="primary" @click.native="submitData" data-status="0" :loading="save_loading" v-if="form.status==0">草稿</Button>
            <Button type="primary" @click.native="submitData" data-status="1" :loading="save_loading" style="margin-left:15px;" v-if="form.status==0">采购</Button>
            <Button type="ghost" @click.native="finishEdit" style="margin-left:15px;">取消</Button>
            <Button type="ghost" @click.native="pagePrint" style="margin-left:15px;" v-if="form.status==1">打印</Button>
          </Form-item>
          </Col>
        </Row>
      </Form>
    </Card>
    <Modal v-model="goodsmodal" title="添加条目">
      <Table :columns="goodscolumns" :data="goodsTableData" stripe></Table>
      <p slot="footer"></p>
    </Modal>
    <Modal v-model="modgoodsmodal" title="修改条目" @on-ok="finishMod">
      <Form :model="modform" :label-width="120" :rules="modrules" ref="modform">
        <Form-item label="数量" prop="goodscount">
          <Input v-model="modform.goodscount"></Input>
        </Form-item>
        <Form-item label="单价" prop="goodsprice">
          <Input v-model="modform.goodsprice" @on-change="changegoodsprice"></Input>
        </Form-item>
        <Form-item label="折扣" prop="rebate">
          <Input v-model="modform.rebate" @on-change="changerebate"></Input>
        </Form-item>
        <Form-item label="折后价" prop="rebateprice">
          <Input v-model="modform.rebateprice" @on-change="changerebateprice"></Input>
        </Form-item>
      </Form>
    </Modal>
    <Modal v-model="goodslistmodal" title="11">
      <Row v-for="item in taglist" :key="item.name">
        <Col span="24"> {{item.name}}：
        <span class="tagspan" data-key="tags" v-for="subitem in item.sublist" :key="subitem.name" @click="clicktag" :data-specid="item.value"
          :data-name="subitem.name" :data-value="subitem.value">{{subitem.name}}</span>
        </Col>
      </Row>
      <Row>
        <Col span="24" style="font-size:14px;">所选条目(
        <template v-for="item in spectypename">
          <span style="color:red;">{{item}}--</span>
        </template>):
        <Input v-model="goodscount" style="width:100px;"></Input>
        </Col>
      </Row>
      <p slot="footer">
        <Button type="ghost" @click.native="goodslistmodal = false">关闭</Button>
        <Button type="primary" @click.native="processgoods">添加</Button>
      </p>
    </Modal>
    <template>
      
    </template>
  </div>
</template>
<style scoped lang="css">
.tagspan {
  color: white;
  display: inline-block;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 2px 5px;
  background-color: #2b85e4;
}
</style>

<script>
import Mixin from "../../../libs/mixindata";
import Bus from "../../../libs/bus";
import { accDiv, accMul } from "../../../libs/common";
export default {
  created() {
    Bus.$on(this.callbackDataValue, data => {
      this.purchasedate = data.purchasedate;
    });
  },
  mixins: [Mixin],
  methods: {
    pagePrint() {
      let newWindow = window.open("_blank"); //打开新窗口
      let codestr = document.getElementById("purchasePrint").innerHTML; //获取需要生成pdf页面的div代码
      newWindow.document.write(codestr); //向文档写入HTML表达式或者JavaScript代码
      newWindow.document.close(); //关闭document的输出流, 显示选定的数据
      newWindow.print(); //打印当前窗口
    },
    changegoodsprice() {
      this.modform.rebateprice =
        parseFloat(this.modform.goodsprice) *
        parseInt(this.modform.rebate) /
        100;
    },
    changerebateprice() {
      this.modform.goodsprice = accMul(
        parseFloat(this.modform.rebateprice),
        accDiv(100, parseInt(this.modform.rebate))
      );
    },
    changerebate() {
      this.modform.rebateprice =
        parseFloat(this.modform.goodsprice) *
        parseInt(this.modform.rebate) /
        100;
      this.modform.goodsprice = accMul(
        parseFloat(this.modform.rebateprice),
        accDiv(100, parseInt(this.modform.rebate))
      );
    },
    changedate(val) {
      this.purchasedate = val;
    },
    finishMod() {
      var currentgoods = this.tableData[this.currentindex];
      currentgoods["goodscount"] = this.modform.goodscount;
      currentgoods["purchaseprice"] = this.modform.goodsprice;
      currentgoods["rebate"] = this.modform.rebate;
      currentgoods["rebateprice"] = this.modform.rebateprice;
      this.$set(this.tableData, this.currentindex, currentgoods);
    },
    clicktag(event) {
      let target = event.toElement;
      let dataset = target.dataset;
      let name = dataset.name;
      let value = dataset.value;
      let specid = dataset.specid;
      document
        .querySelectorAll("[data-specid='" + specid + "']")
        .forEach((value, index) => {
          value.style.backgroundColor = "#2b85e4";
        });
      this.spectypenamestr = "";
      this.spectypeidstr = "";
      target.style.backgroundColor = "red";
      this.$set(this.spectypename, specid, name);
      this.$set(this.spectypeid, specid, value);
      for (let key in this.spectypename) {
        this.spectypenamestr =
          this.spectypenamestr + "," + this.spectypename[key];
      }
      this.spectypenamestr = this.spectypenamestr.substring(1);
      for (let key in this.spectypeid) {
        this.spectypeidstr = this.spectypeidstr + "," + this.spectypeid[key];
      }
      this.spectypeidstr = this.spectypeidstr.substring(1);
    },
    showgoods() {
      this.goodsmodal = true;
    },
    showmodgoods(data) {
      this.modgoodsmodal = true;
      this.modform.goodscount = data.goodscount;
      this.modform.goodsprice = data.purchaseprice;
      this.modform.rebate = data.rebate;
      this.modform.rebateprice = data.rebateprice;
    },
    checkgoods() {
      let flag = false;
      this.tableData.forEach((value, index) => {
        let goodsid = value.goodsid;
        let spectypeid = value.spectypeid;
        if (
          this.spectypeidstr == spectypeid &&
          this.currentgoodsid == goodsid
        ) {
          flag = true;
          value["goodscount"] =
            parseInt(this.goodscount) + parseInt(value.goodscount);
          return;
        }
      });
      return flag;
    },
    processgoods() {
      if (!this.checkgoods()) {
        this.$http
          .post("ivc/goods/query/entity", { id: this.currentgoodsid })
          .then(response => {
            let o = response.data.b;
            this.tableData.push({
              goodsid: o.id,
              goodsname: o.goodsname,
              goodsno: o.goodsno,
              spectypeid: this.spectypeidstr,
              specs: this.spectypenamestr,
              goodscount: this.goodscount,
              purchaseprice: o.purchaseprice,
              rebate: 100,
              rebateprice: o.purchaseprice
            });
          });
      }
    },
    queryGoods() {
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
    queryStock(id) {
      this.$http
        .post("ivc/stock/query/list", {
          purchaseid: id,
          type: "2"
        })
        .then(response => {
          let o = response.data.b;
          o.forEach((value, index) => {
            this.tableData.push({
              goodsid: value.goodsid,
              goodsname: value.goodsname,
              goodsno: value.goodsno,
              spectypeid: value.spectypeids,
              specs: value.spectypenames,
              goodscount: value.goodscount,
              purchaseprice: value.goodsprice / 100,
              rebate: value.rebate,
              rebateprice: value.rebateprice / 100
            });
          });
        });
    },
    queryGoodsSpec(goodsid) {
      this.$http
        .post("ivc/goods/spec", {
          goodsid: goodsid
        })
        .then(response => {
          let o = response.data.b;
          this.taglist = [];
          o.forEach((value, index) => {
            let specname = value.specname;
            let specid = value.specid;
            let spectypeids = value.spectypeids.split(",");
            let spectypenames = value.spectypenames.split(",");
            let sublist = [];
            spectypeids.forEach((value, index) => {
              sublist.push({
                name: spectypenames[index],
                value: spectypeids[index]
              });
            });
            this.taglist.push({
              name: specname,
              sublist: sublist,
              value: specid
            });
          });
        });
    },
    selectgoods(id) {
      this.goodslistmodal = true;
      this.goodsmodal = false;
      this.queryGoodsSpec(id);
      this.spectypename = {};
      this.spectypeid = {};
      this.currentgoodsid = id;
      document.querySelectorAll("[data-key='tags']").forEach((value, index) => {
        value.style.backgroundColor = "#2b85e4";
      });
    },
    submitData(e) {
      var $this = this;
      this.form.purchasedate = this.purchasedate;
      this.form.goodsid = [];
      this.form.goodscount = [];
      this.form.goodsprice = [];
      this.form.rebate = [];
      this.form.rebateprice = [];
      this.form.spectypenames = [];
      this.form.spectypeids = [];
      this.form.status = e.target.dataset.status;
      this.tableData.forEach((value, index) => {
        this.form.goodsid.push(value.goodsid);
        this.form.goodscount.push(value.goodscount);
        this.form.goodsprice.push(value.purchaseprice);
        this.form.rebate.push(value.rebate);
        this.form.rebateprice.push(value.rebateprice);
        this.form.spectypenames.push(value.specs);
        this.form.spectypeids.push(value.spectypeid);
      });
      $this.$refs.form.validate(valid => {
        if (valid) {
          $this.save_loading = true;
          $this.$http.post($this.saveaction, $this.form).then(response => {
            var c = response.data.h.c;
            if (c == "0") {
              $this.$Message.success(response.data.h.m);
              Bus.$emit(this.getDataValue);
              $this.finishEdit();
            } else {
              $this.$Message.error(response.data.h.m);
            }
            $this.save_loading = false;
          });
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.querySupplier();
    this.queryStore();
    this.queryAccount();
    this.queryGoods();
    let id = this.$route.params.id;
    if (id != "new") {
      this.queryStock(id);
    }
  },
  data() {
    return {
      taglist: [],
      goodscount: 0,
      spectypename: {},
      spectypenamestr: "",
      spectypeid: {},
      spectypeidstr: "",
      modgoodsmodal: false,
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
          title: "操作",
          key: "action",
          render: (h, params) => {
            if (this.form.status == 0) {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    on: {
                      click: e => {
                        let currentRowData = this.tableData[params.index];
                        this.showmodgoods(currentRowData);
                        this.currentindex = params.index;
                      }
                    }
                  },
                  "修改"
                ),
                h(
                  "Button",
                  {
                    style: {
                      marginLeft: "5px"
                    },
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: e => {
                        this.tableData.splice(params.index, 1);
                      }
                    }
                  },
                  "刪除"
                )
              ]);
            } else {
              return "";
            }
          }
        },
        {
          title: "商品",
          key: "goodsname"
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
      modform: {
        goodsprice: "",
        goodscount: "",
        rebate: "",
        rebateprice: ""
      },
      modrules: {},
      purchasedate: "",
      form: {
        supplierid: "",
        storeid: "",
        accountid: "",
        money: "0",
        status: "0",
        purchasedate: "",
        id: "",
        remark: "",
        goodsid: [],
        goodscount: [],
        spectypeids: [],
        spectypenames: [],
        rebate: [],
        rebateprice: [],
        goodsprice: []
      },
      currentgoodsid: "",
      currentindex: 0,
      supplierList: [],
      storeList: [],
      accountList: [],
      prename: "ivc_purchase",
      name: "ivcedit_purchase",
      module: "ivc/purchase",
      rules: {
        supplierid: [
          {
            type: "number",
            required: true,
            message: "请选择供应商",
            trigger: "blur"
          }
        ],
        storeid: [
          {
            type: "number",
            required: true,
            message: "请选择仓库",
            trigger: "blur"
          }
        ],
        accountid: [
          {
            type: "number",
            required: true,
            message: "请选择账户",
            trigger: "blur"
          }
        ]
      }
    };
  }
};
</script>