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
                    <Button type="ghost" @click="handleRemove(index)">删除</Button>
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
      <Row>
        <Col span="24">
        <Form-item label="初使库存设置">
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
            <Select v-model="spec"  @on-change="changespec">
              <Option v-for="item in specList" :value="item.id" :key="item.id">{{ item.specname }}</Option>
          </Select>
          <Checkbox-group v-model="spectypeids"  @on-change="checkAllGroupChange" style="margin-top:10px;">
              <Checkbox  size="large" :label="item.id" v-for="item in specTypeList"  :key="item.id"><span>{{item.spectypename}}</span></Checkbox>
          </Checkbox-group>
          <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            size="large"
            scrollable="true"
             style="margin-top:10px;"
            @click.prevent.native="handleCheckAll" v-show="specTypeList.length>0">全选</Checkbox>
    </Modal>
  </Card>
  </div>
</template>
<script>
import Mixin from "../../../libs/mixindata";
import Bus from "../../../libs/bus";
export default {
  mixins: [Mixin],
  created() {
    Bus.$on(this.callbackDataValue, data => {
      this.queryGoodsType(data);
      this.queryBrand();
      this.querySpec(data);
      let spectypeids = data.spectypeid.split(";");
      let specs = data.specs.split(";");
      let specids = data.specid.split(";");
      this.form.spectypeids = [];
      this.form.specids = [];
      specs.forEach((value, index) => {
        this.form.items.push({ value: value });
        this.form.spectypeids.push(spectypeids[index]);
        this.form.specids.push(specids[index]);
      });
    });
  },
  methods: {
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
    },
    selectspec(index) {
      this.specmodal = true;
      this.itemindex = index;
      this.spec = this.specList[index].id;
    },
    queryGoodsType(data) {
      let $this = this;
      this.$http.post("ivc/goodsType/treeAll", {}).then(response => {
        let o = response.data.b;
        this.processoptions(o);
        this.goodstypelist = o;
        $this.$nextTick(() => {
          $this.goodstypeArr = data.goodstypeids.split(",");
        });
      });
    },
    handleCheckAll() {
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
      this.form.spectypeids.push({});
    },
    handleRemove(index) {
      this.form.items.splice(index, 1);
      this.form.spectypeids.splice(index,1);
      this.form.specids.splice(index,1);
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
          $this.specTypeList = o;
          this.$nextTick(() => {
            this.spectypeids = this.form.spectypeids[this.itemindex].split(",").map(s=>+s);
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
    }
  },
  data() {
    return {
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
        items: [],
        brandid: 0,
        seq: 0,
        id: ""
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
      }
    };
  }
};
</script>