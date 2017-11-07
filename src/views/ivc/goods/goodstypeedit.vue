<template>
  <Card>
  <Form :model="form" :label-width="120" :rules="rules" ref="form" style="width:50%;">
    <Form-item label="分类名称" prop="goodstypename">
      <Input v-model="form.goodstypename"></Input>
    </Form-item>
    <Form-item label="分类描述：" prop="goodstypedesc">
      <Input v-model="form.goodstypedesc"></Input>
    </Form-item>
    <Form-item label="排序号：" prop="seq" >
      <Input v-model="form.seq"></Input>
    </Form-item>
    <Form-item>
  <Button type="primary" @click.native="submitData" :loading="save_loading">保存</Button>
  <Button type="ghost" @click.native="finishEdit()" style="margin-left:15px;">取消</Button>
    </Form-item>
  </Form>
  </Card>
</template>
<script>
import Mixin from "../../../libs/mixindata";
import Bus from "../../../libs/bus";
export default {
  mixins: [Mixin],
  methods: {
    getDataCallback(params){
      this.form.parentid = params.parentid;
    }
  },
  data() {
    var $this = this;
    
    return {
      form: {
        goodstypename: "",
        goodstypedesc: "",
        seq: 0,
        id: "",
        parentid: 0
      },
      prename: "ivc_goodstype",
      name: "ivcedit_goodstype",
      module: "ivc/goodsType",
      rules: {
        goodstypename: [{ required: true, message: "请输入分类名称", trigger: "blur" }]
      }
    };
  }
};
</script>
