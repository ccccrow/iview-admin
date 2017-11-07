<template>
  <Card>
  <Form :model="form" :label-width="120" :rules="rules" ref="form" style="width:50%;">
    <Form-item label="品牌名称" prop="brandname">
      <Input v-model="form.brandname"></Input>
    </Form-item>
    <Form-item label="品牌网址" prop="brandsite">
      <Input v-model="form.brandsite"></Input>
    </Form-item>
    <Form-item label="品牌描述：" prop="branddesc">
      <Input v-model="form.branddesc"></Input>
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
  data() {
    return {
      form: {
        brandname: "",
        brandnamedesc: "",
        brandsite: "",
        seq: 0,
        id: ""
      },
      prename: "ivc_brand",
      name: "ivcedit_brand",
      module: "ivc/brand",
      rules: {
        brandname: [{ required: true, message: "请输入品牌名称", trigger: "blur" }]
      }
    };
  }
};
</script>
