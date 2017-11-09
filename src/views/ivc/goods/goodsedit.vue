<template>
<div style="height:1000px;overflow:auto;">
  <Card>
    <Form :model="form" :label-width="120" :rules="rules" ref="form" style="width:80%;">
      <Row>
        <Col span="12">
        <Form-item label="商品名称" prop="goodsname">
          <Input v-model="form.goodsname"></Input>
        </Form-item>
        </Col>
        <Col span="12">
        <Form-item label="商品货号" prop="goodsno">
          <Input v-model="form.goodsno"></Input>
        </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <Form-item label="采购价" prop="purchaseprice">
          <Input v-model="form.purchaseprice"></Input>
        </Form-item>
        </Col>
        <Col span="12">
        <Form-item label="批发价" prop="wholesaleprice">
          <Input v-model="form.wholesaleprice"></Input>
        </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <Form-item label="建议零售价" prop="sgretailprice">
          <Input v-model="form.sgretailprice"></Input>
        </Form-item>
        </Col>
        <Col span="12">
        <Form-item label="零售价" prop="retailprice">
          <Input v-model="form.retailprice"></Input>
        </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <Form-item label="库存预警下限" prop="warnlower">
          <Input v-model="form.warnlower"></Input>
        </Form-item>
        </Col>
        <Col span="12">
        <Form-item label="库存预警上限" prop="warnlimit">
          <Input v-model="form.warnlimit"></Input>
        </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <Form-item label="品牌" prop="brandid">
          <Select v-model="form.brandid">
              <Option v-for="item in brandList" :value="item.id" :key="item.id">{{ item.brandname }}</Option>
          </Select>
        </Form-item>
        </Col>
        <Col span="12">
        <Form-item label="分类">
          <Cascader :data="goodstypelist" :value="goodstypeArr" change-on-select @on-change="onchange"></Cascader>
        </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="24">
        <FormItem
            v-for="(item, index) in form.items"
            :key="index"
            :label="'规格' + (index + 1)"
            :prop="'items.' + index + '.value'"
            :rules="{required: true, message: '规格' + (index + 1) +'不能为空', trigger: 'blur'}">
            <Row>
                <Col span="18">
                    <Input type="text" v-model="item.value"  readonly ></Input>
                </Col>
                <Col span="4" offset="1">
                    <Button type="primary" @click="selectspec(index)">选择</Button>
                    <Button type="ghost" @click="handleRemove(index)" v-if="index!=0">删除</Button>
                </Col>
            </Row>
        </FormItem>
        <FormItem>
            <Row>
                <Col span="12">
                    <Button type="dashed" long @click="handleAdd" icon="plus-round">添加规格</Button>
                </Col>
            </Row>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <Form-item label="排序" prop="seq">
          <Input v-model="form.seq"></Input>
        </Form-item>
        </Col>
        <Col span="12">
        <Form-item label="状态" prop="status">
          <Select v-model="form.status">
            <Option v-for="item in statuslist" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        </Col>
      </Row>
      <Row v-if="form.id==''">
        <Col span="24">
        <Form-item label="初使库存设置">
          <Button type="primary" @click.native="showstock">点击初使化库存</Button>
        </Form-item>
        </Col>
      </Row>
      <Form-item>
        <Button type="primary" @click.native="submitData" :loading="save_loading">保存</Button>
        <Button type="ghost" @click.native="finishEdit()" style="margin-left:15px;">取消</Button>
      </Form-item>
    </Form>
    <Modal
        v-model="specmodal"
        title="选择规格"
        @on-ok="finishSpec">
            <Select v-model="spec"  @on-change="changespec" :disabled="specdisabled">
              <Option v-for="item in specList" :value="item.id" :key="item.id">{{ item.specname }}</Option>
          </Select>
          <Checkbox-group v-model="spectypeids"  @on-change="checkAllGroupChange" style="margin-top:10px;">
              <Checkbox  size="large" :disabled="item.disabled" :label="item.id" v-for="item in specTypeList"  :key="item.id"><span>{{item.spectypename}}</span></Checkbox>
          </Checkbox-group>
          <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            size="large"
            scrollable="true"
            :disabled="checkAllDisabled"
             style="margin-top:10px;"
            @click.prevent.native="handleCheckAll" v-show="specTypeList.length>0">全选</Checkbox>
    </Modal>
    <Modal v-model="stockmodal" title="11">
      <Row v-for="item in taglist" :key="item.name">
        <Col span="24"> {{item.name}}：
        <span class="tagspan" data-key="tags" v-for="subitem in item.sublist" :key="subitem.name" @click="clicktag" :data-specid="item.value"
          :data-name="subitem.name" :data-value="subitem.value">{{subitem.name}}</span>
        </Col>
      </Row>
      <Row>
        <Col>
        <Button type="primary" @click.native="addspec">添加</Button>
        </Col>
      </Row>
      <Row>
        <Col span="24" style="font-size:14px;">
          <Table :columns="columns" :data="tableData" stripe></Table>
        </Col>
      </Row>
      <p slot="footer">
        <Button type="ghost" @click.native="closestock">取消</Button>
        <Button type="primary" @click.native="savestock">保存</Button>
      </p>
    </Modal>
  </Card>
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
  created() {
    if (this.form.id == "") {
      this.queryGoodsType();
      this.queryBrand();
      this.querySpec();
    }
    Bus.$on(this.callbackDataValue, data => {
      let spectypeids = data.spectypeid.split(";");
      let specs = data.specs.split(";");
      let specids = data.specid.split(";");
      let specnames = data.specname.split(";");
      this.form.spectypeids = [];
      this.form.specids = [];
      this.form.specnames = [];
      specs.forEach((value, index) => {
        this.form.items.push({ value: value });
        this.form.spectypeids.push(spectypeids[index]);
        this.form.specids.push(specids[index]);
        this.form.specnames.push(specnames[index]);
        this.disablespectypes.push(
          ...spectypeids[index].split(",").map(s => +s)
        );
      });
      this.queryGoodsType(data);
      this.queryBrand();
      this.querySpec(data);
    });
  },
  methods: {
    closestock() {
      this.stockmodal = false;
      this.tableData = [];
    },
    savestock() {
      this.stockmodal = false;
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
    addspec() {
      this.tableData.forEach((value, index) => {});
      this.tableData.push({
        spectypeid: this.spectypeidstr,
        spectypename: this.spectypenamestr,
        goodscount: 0
      });
      console.log(this.tableData);
    },
    showstock() {
      this.stockmodal = true;
      this.taglist = [];
      let spectypeids = this.form.spectypeids;
      let specids = this.form.specids;
      let items = this.form.items;
      let specnames = this.form.specnames;
      specids.forEach((value, index) => {
        let itemvalue = items[index].value.split(",");
        let spectypeid = spectypeids[index].split(",");
        let sublist = [];
        itemvalue.forEach((itemvalue, itemindex) => {
          sublist.push({
            name: itemvalue,
            value: spectypeid[index]
          });
        });
        this.taglist.push({
          name: specnames[index],
          sublist: sublist,
          value: value
        });
      });
      console.log(this.form.spectypeids);
      console.log(this.form.specids);
      console.log(this.form.items);
    },
    finishSpec() {
      let spectypenames = [];
      let $this = this;
      this.specTypeList.forEach((value, index) => {
        $this.spectypeids.forEach((subvalue, index) => {
          if (value.id === subvalue) {
            spectypenames.push(value.spectypename);
          }
        });
      });
      this.form.items[this.itemindex].value = spectypenames.join(",");
      this.form.spectypeids[this.itemindex] = this.spectypeids.join(",");
      this.form.specids[this.itemindex] = this.spec;
      this.specList.forEach((value, index) => {
        if (this.spec == value.id) {
          this.form.specnames[this.itemindex] = value.specname;
        }
      });
    },
    selectspec(index) {
      this.specmodal = true;
      this.itemindex = index;
      alert(this.specList.length)
      this.spec = this.specList[index].id;
      if (this.form.items[this.itemindex].value == "") {
        this.spectypeids = [];
        this.indeterminate = false;
        this.checkAll = false;
        this.specdisabled = false;
        this.checkAllDisabled = false;
      }else{
        this.specdisabled = true;
      }
    },
    queryGoodsType(data) {
      let $this = this;
      this.$http.post("ivc/goodsType/treeAll", {}).then(response => {
        let o = response.data.b;
        this.processoptions(o);
        this.goodstypelist = o;
        if (data) {
          $this.$nextTick(() => {
            $this.goodstypeArr = data.goodstypeids.split(",");
          });
        }
      });
    },
    handleCheckAll() {
      if (!this.checkAllDisabled) {
        if (this.indeterminate) {
          this.checkAll = false;
        } else {
          this.checkAll = !this.checkAll;
        }
        this.indeterminate = false;
        if (this.checkAll) {
          this.spectypeids = this.specTypeList.map((value, index) => {
            return value.id;
          });
        } else {
          this.spectypeids = [];
        }
      }
    },
    checkAllGroupChange(data) {
      if (data.length === this.specTypeList.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    handleAdd() {
      this.form.items.push({
        value: ""
      });
      this.form.spectypeids.push("");
    },
    handleRemove(index) {
      this.form.items.splice(index, 1);
      this.form.spectypeids.splice(index, 1);
      this.form.specids.splice(index, 1);
    },
    queryBrand() {
      this.$http.post("ivc/brand/query/list", {}).then(response => {
        let o = response.data.b;
        this.brandList = o;
      });
    },
    querySpec(data) {
      this.$http.post("ivc/spec/query/list", {}).then(response => {
        let o = response.data.b;
        this.specList = o;
      });
    },
    querySpecType(specid) {
      let $this = this;
      this.$http
        .post("ivc/specType/query/list", { specid: specid })
        .then(response => {
          let o = response.data.b;
          $this.specTypeList = o; //如果是查询出来的已配置完的商品规格，需要禁用选择
          console.log($this.disablespectypes);
          $this.specTypeList.forEach((value, index) => {
            let flag = false;
            $this.disablespectypes.forEach((subvalue, subindex) => {
              if (subvalue == value.id) {
                flag = true;
                return;
              }
            });
            value["disabled"] = flag;
            if (flag) {
              this.checkAllDisabled = true;
            }
          });
          this.$nextTick(() => {
            if (this.form.spectypeids[this.itemindex]) {
              this.spectypeids = this.form.spectypeids[this.itemindex]
                .split(",")
                .map(s => +s);
            }
          });
        });
    },
    processoptions(options) {
      if (options) {
        options.forEach((o, index) => {
          o.label = o.text;
          o.value = o.id + "";
          if (o.children && o.children.length > 0) {
            this.processoptions(o.children);
          } else {
            o.children = [];
          }
        });
      }
    },
    changebrand(val) {},
    changespec(val) {
      if (val) {
        this.querySpecType(val);
        this.spectypeids = [];
      }
    },
    onchange(val) {
      this.form.goodstypeids = val.join(",");
      this.form.goodstypeid = val[val.length - 1];
    },
    submitData() {
      var $this = this;
      this.tableData.forEach((value, index) => {
        this.form.stockspectypeids = value.spectypeid;
        this.form.stockspectypenames = value.spectypename;
        this.form.stockgoodscount = value.goodscount;
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
  data() {
    return {
      specdisabled: false,
      checkAllDisabled: false,
      disablespectypes: [], //需要禁用选择的规格
      spectypename: {},
      spectypenamestr: "",
      spectypeid: {},
      spectypeidstr: "",
      stockmodal: false,
      taglist: [],
      indeterminate: true,
      checkAll: false,
      spectypenames: "",
      specmodal: false,
      spectypeids: [],
      goodstypeArr: [],
      goodstypelist: [],
      specList: [],
      specTypeList: [],
      spec: 0,
      brandList: [],
      itemindex: 0,
      form: {
        goodsname: "",
        status: 1,
        goodsno: "",
        purchaseprice: 0,
        wholesaleprice: 0,
        sgretailprice: 0,
        retailprice: 0,
        warnlower: 0,
        warnlimit: 100,
        goodstypeid: 0,
        goodstypeids: "",
        spectypeids: [],
        specids: [],
        specnames: [],
        items: [],
        brandid: 0,
        seq: 0,
        id: "",
        stockspectypeids: [], //库存需要
        stockspectypenames: [], //库存需要
        stockgoodscount: [] //库存需要
      },
      prename: "ivc_goods",
      name: "ivcedit_goods",
      module: "ivc/goods",
      rules: {
        goodsname: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ]
      },
      columns: [
        {
          title: "规格",
          key: "spectypename"
        },
        {
          title: "数量",
          key: "goodscount",
          render: (h, params) => {
            let currentRowData = this.tableData[params.index];
            return h("Input", {
              props: {
                value: currentRowData.goodscount
              },
              on: {
                "on-change": e => {
                  currentRowData.goodscount = e.target.value;
                }
              }
            });
          }
        }
      ],
      tableData: []
    };
  }
};
</script>