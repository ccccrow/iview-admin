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
       <DatePicker type="date" placeholder="选择日期" format="yyyy-MM-dd" v-model="form.purchasedate"  @on-change="changedate"></DatePicker>
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
  <Button type="primary" @click.native="submitData" :loading="save_loading" v-if="form.status==0">草稿</Button>
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
        <Row v-for="item in taglist" :key="item.name">
          <Col span="24">
            {{item.name}}：<span class="tagspan" data-key="tags" v-for="subitem in item.sublist" :key="subitem.name" @click="clicktag" :data-specid="item.value" :data-name="subitem.name" :data-value="subitem.value">{{subitem.name}}</span>
          </Col>
        </Row>
        <Row>
          <Col span="24" style="font-size:14px;">所选条目(<template v-for="item in spectypename"><span style="color:red;">{{item}}--</span></template>):<Input v-model="goodscount" style="width:100px;"></Input></Col>
        </Row>
        <p slot="footer">
          <Button type="ghost" @click.native="goodslistmodal = false" >关闭</Button>
            <Button type="primary" @click.native="processgoods" >添加</Button>
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
export default {
  mixins: [Mixin],
  methods: {
    changedate(val){
      this.form.purchasedate = val;
    },
    clicktag(event){
      let target = event.toElement;
      let dataset = target.dataset;
      let name = dataset.name;
      let value = dataset.value;
      let specid = dataset.specid;
      document.querySelectorAll("[data-specid='"+specid+"']").forEach((value,index)=>{
        value.style.backgroundColor="#2b85e4"
      })
      this.spectypenamestr ="";
      this.spectypeidstr = "";
      target.style.backgroundColor="red"
      this.$set(this.spectypename,specid,name);
      this.$set(this.spectypeid,specid,value);
      for(let key in this.spectypename){
        this.spectypenamestr = this.spectypenamestr+","+this.spectypename[key];
      }
      this.spectypenamestr = this.spectypenamestr.substring(1)
      for(let key in this.spectypeid){
        this.spectypeidstr = this.spectypeidstr+","+this.spectypeid[key];
      }
      this.spectypeidstr = this.spectypeidstr.substring(1)
    },
    showgoods() {
      this.goodsmodal = true;
    },
    checkgoods(){
      let flag = false;
      this.tableData.forEach((value,index)=>{
        let goodsid = value.goodsid;
        let spectypeid = value.spectypeid;
        if(this.spectypeidstr==spectypeid&&this.currentgoodsid==goodsid){
            flag =true;
            value['goodscount'] = parseInt(this.goodscount) + parseInt(value.goodscount);
            return;
        }
      });
      return flag;
    },
    processgoods(){
      if(!this.checkgoods()){
          this.$http.post("ivc/goods/query/"+this.currentgoodsid, {}).then(response => {
            let o = response.data.b;
            this.tableData.push({'goodsid':o.id,'goodsname':o.goodsname,'goodsno':o.goodsno,'spectypeid':this.spectypeidstr,'specs':this.spectypenamestr,goodscount:this.goodscount,purchaseprice:o.purchaseprice,rebate:100,rebateprice:o.purchaseprice})
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
    queryPurchaseSpec(id){
      this.$http.post("ivc/purchaseSpec/query/list", {'purchaseid':id}).then(response => {
        let o = response.data.b;
        o.forEach((value,index)=>{
          this.tableData.push({'goodsid':value.goodsid,'goodsname':value.goodsname,'goodsno':value.goodsno,'spectypeid':value.spectypeids,'specs':value.spectypenames,goodscount:value.goodscount,purchaseprice:value.goodsprice/100,rebate:value.rebate,rebateprice:value.rebateprice/100})
        });
      });
    },
    queryGoodsSpec(goodsid) {
      this.$http.post("ivc/goods/spec", { goodsid: goodsid }).then(response => {
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
          this.taglist.push({ name: specname, sublist: sublist,value:specid });
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
      document.querySelectorAll("[data-key='tags']").forEach((value,index)=>{
        value.style.backgroundColor="#2b85e4"
      })
    },
    submitData() {
      var $this = this;
      this.tableData.forEach((value,index) =>{
          this.form.goodsid.push(value.goodsid);
          this.form.goodscount.push(value.goodscount);
          this.form.goodsprice.push(value.purchaseprice);
          this.form.rebate.push(value.rebate);
          this.form.rebateprice.push(value.rebateprice);
          this.form.spectypenames.push(value.specs);
          this.form.spectypeids.push(value.spectypeid);
      });
      console.log(this.form)
      $this.$refs.form.validate((valid) => {
        if (valid) {
          $this.save_loading = true;
          $this.$http.post( $this.saveaction, $this.form)
            .then((response) => {
              var c = response.data.h.c;
              if (c == "0") {
                $this.$Message.success(response.data.h.m);
                Bus.$emit(this.getDataValue);
                $this.finishEdit();
              } else {
                $this.$Message.error(response.data.h.m);
              }
              $this.save_loading = false;
            })
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    this.querySupplier();
    this.queryStore();
    this.queryAccount();
    this.queryGoods();
    let id = this.$route.params.id;
    if(id!='new'){
      this.queryPurchaseSpec(id);
    }
  },
  data() {
    return {
      taglist: [],
      goodscount:0,
      spectypename:{},
      spectypenamestr:"",
      spectypeid:{},
      spectypeidstr:"",
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
      form: {
        supplierid: "",
        storeid: "",
        accountid: "",
        money: "0",
        status:0,
        purchasedate: "",
        id: "",
        remark: "",
        goodsid:[],
        goodscount:[],
        spectypeids:[],
        spectypenames:[],
        rebate:[],
        rebateprice:[],
        goodsprice:[]
      },
      currentgoodsid:"",
      supplierList: [],
      storeList: [],
      accountList: [],
      prename: "ivc_purchase",
      name: "ivcedit_purchase",
      module: "ivc/purchase",
      rules: {
        supplierid: [{type:"number", required: true, message: "请选择供应商", trigger: "blur" }],
        storeid: [{ type:"number",required: true, message: "请选择仓库", trigger: "blur" }],
        accountid: [{ type:"number",required: true, message: "请选择账户", trigger: "blur" }]
      }
    };
  }
};
</script>
