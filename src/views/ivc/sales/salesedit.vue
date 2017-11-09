<template>
  <div>
    <Card>
      <Form :model="form" :label-width="120" :rules="rules" ref="form" style="width:98%;">
        <Row>
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
          <Form-item label="实收金额" prop="money">
            <Input v-model="form.money" @on-change="changemoney"></Input>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="会员手机号码" prop="mobile">
            <AutoComplete v-model="form.mobile" @on-select="queryMemberDetail" :data="memberList" :filter-method="filterMethod" placeholder="请输入" style="width:200px"></AutoComplete>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="18">
          <Form-item label="备注" prop="remark">
            <Input v-model="form.remark" type="textarea"></Input>
          </Form-item>
          </Col>
          <Col span="6">
          <Form-item label="会员姓名" prop="realname">
            <Input v-model="form.realname"></Input>
          </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <Button type="primary" @click.native="showgoods"  v-if="form.id==''">添加条目</Button>
          <Button type="primary" @click.native="showrebate"  v-if="form.id==''">整单折扣</Button>
          当前折扣：{{form.rebate}}%
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
            <Button type="primary" @click.native="submitData" :loading="save_loading" style="margin-left:15px;" v-if="form.id==''">结账</Button>
             <Button type="error" @click.native="deleteData" :loading="save_loading" style="margin-left:15px;" v-if="form.id!=''">撤消</Button>
            <Button type="ghost" @click.native="finishEdit()" style="margin-left:15px;">取消</Button>
          </Form-item>
          </Col>
        </Row>
      </Form>
    </Card>
    <Modal v-model="goodsmodal" title="添加条目">
      <Table :columns="goodscolumns" :data="goodsTableData" stripe></Table>
      <p slot="footer"></p>
    </Modal>
    <Modal v-model="rebatemodel" title="整单折扣" @on-ok="finishRebate">
      <Input v-model="form.rebate" style="width:100px;"></Input>
    </Modal>
    <Modal v-model="modgoodsmodal" title="修改条目" @on-ok="finishMod">
      <Form :model="modform" :label-width="120" :rules="modrules" ref="modform">
        <Form-item label="数量" prop="goodscount">
          <Input v-model="modform.goodscount" @on-change="changegoodscount"></Input>
        </Form-item>
        <Form-item label="单价" prop="goodsprice">
          <Input v-model="modform.goodsprice" @on-change="changegoodsprice"></Input>
        </Form-item>
        <Form-item label="备注" prop="remark">
          <Input v-model="modform.remark" type="textarea"></Input>
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
import { accDiv, accMul, accAdd } from "../../../libs/common";
export default {
  created() {
    Bus.$on(this.callbackDataValue, data => {
      this.form.money = this.form.money / 100;
    });
  },
  mixins: [Mixin],
  methods: {
    filterMethod(value, option) {
      return option.indexOf(value) !== -1;
    },
    changegoodscount() {},
    changegoodsprice() {},
    deleteData() {
      var $this = this;
      this.$Modal.confirm({
        title: "二次确认",
        content: "<p>是否撤消该零售单</p>",
        onOk: () => {
          this.$http
            .post("ivc/sales/delete", {
              id: $this.form.id
            })
            .then(response => {
              if (response.data.h.c == "0") {
                Bus.$emit(this.getDataValue);
                $this.finishEdit();
              } else {
                $this.$Message.error(response.data.h.m);
              }
            });
        }
      });
    },
    changemoney() {
      let allmoney = 0;
      this.tableData.forEach((value, index) => {
        allmoney = accAdd(
          allmoney,
          accMul(value.goodscount, value.retailprice)
        );
      });
      this.form.rebate = (this.form.money / allmoney * 100).toFixed(0);
    },
    finishRebate() {
      this.calMoney();
    },
    finishMod() {
      var currentgoods = this.tableData[this.currentindex];
      currentgoods["goodscount"] = this.modform.goodscount;
      currentgoods["retailprice"] = this.modform.goodsprice;
      currentgoods["remark"] = this.modform.remark;
      this.$set(this.tableData, this.currentindex, currentgoods);
      this.calMoney();
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
    showrebate() {
      this.rebatemodel = true;
    },
    showmodgoods(data) {
      this.modgoodsmodal = true;
      this.modform.goodscount = data.goodscount;
      this.modform.goodsprice = data.retailprice;
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
          .post("ivc/goods/query/" + this.currentgoodsid, {})
          .then(response => {
            let o = response.data.b;
            this.tableData.push({
              goodsid: o.id,
              goodsname: o.goodsname,
              goodsno: o.goodsno,
              spectypeid: this.spectypeidstr,
              specs: this.spectypenamestr,
              goodscount: this.goodscount,
              retailprice: o.retailprice,
              remark: ""
            });
            this.calMoney();
          });
      }
    },
    calMoney() {
      this.form.money = 0;
      this.tableData.forEach((value, index) => {
        this.form.money = accAdd(
          this.form.money,
          accMul(
            value.goodscount,
            accMul(value.retailprice, this.form.rebate / 100)
          )
        );
      });
    },
    queryGoods() {
      this.$http.post("ivc/goods/query/list", {}).then(response => {
        let o = response.data.b;
        this.goodsTableData = o;
      });
    },
    queryStore() {
      this.$http.post("ivc/store/query/list", {}).then(response => {
        let o = response.data.b;
        this.storeList = o;
        this.form.storeid = o[0].id;
      });
    },
    queryMember() {
      this.$http.post("ivc/member/query/list", {}).then(response => {
        let o = response.data.b;
        o.forEach((value, index) => {
          this.memberList.push(value.mobile);
        });
      });
    },
    queryMemberDetail() {
      this.$http
        .post("ivc/member/query/entity", { mobile: this.form.mobile })
        .then(response => {
          let o = response.data.b;
          this.form.memberid = o.id;
          this.form.realname = o.realname;
        });
    },
    queryAccount() {
      this.$http.post("ivc/account/query/list", {}).then(response => {
        let o = response.data.b;
        this.accountList = o;
        this.form.accountid = o[0].id;
      });
    },
    queryStock(id) {
      this.$http
        .post("ivc/stock/query/list", {
          purchaseid: id,
          type: "3"
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
              retailprice: value.goodsprice / 100,
              remark: value.remark
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
    submitData() {
      var $this = this;
      this.form.goodsid = [];
      this.form.goodscount = [];
      this.form.goodsprice = [];
      this.form.spectypenames = [];
      this.form.spectypeids = [];
      this.form.remarks = [];
      this.tableData.forEach((value, index) => {
        this.form.goodsid.push(value.goodsid);
        this.form.goodscount.push(value.goodscount);
        this.form.goodsprice.push(value.retailprice);
        this.form.spectypenames.push(value.specs);
        this.form.spectypeids.push(value.spectypeid);
        this.form.remarks.push(value.remark);
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
    this.queryStore();
    this.queryAccount();
    this.queryGoods();
    this.queryMember();
    let id = this.$route.params.id;
    if (id != "new") {
      this.queryStock(id);
    }
  },
  data() {
    return {
      memberList: [],
      taglist: [],
      goodscount: 0,
      spectypename: {},
      spectypenamestr: "",
      spectypeid: {},
      spectypeidstr: "",
      modgoodsmodal: false,
      goodsmodal: false,
      goodslistmodal: false,
      rebatemodel: false,
      rebate: 100,
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
            if (this.form.id == "") {
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
          key: "retailprice"
        },
        {
          title: "备注",
          key: "remark"
        }
      ],
      tableData: [],
      modform: {
        goodsprice: "",
        goodscount: "",
        remark: ""
      },
      modrules: {},
      form: {
        storeid: "",
        accountid: "",
        money: "0",
        id: "",
        remark: "",
        memberid: "",
        mobile: "",
        realname: "",
        goodsid: [],
        goodscount: [],
        spectypeids: [],
        spectypenames: [],
        remarks: [],
        rebate: 100,
        rebateprice: [],
        goodsprice: []
      },
      currentgoodsid: "",
      currentindex: 0,
      supplierList: [],
      storeList: [],
      accountList: [],
      prename: "ivc_sales",
      name: "ivcedit_sales",
      module: "ivc/sales",
      rules: {
        mobile: [
          {
            required: true,
            message: "请选择会员",
            trigger: "blur"
          }
        ]
      }
    };
  }
};
</script>