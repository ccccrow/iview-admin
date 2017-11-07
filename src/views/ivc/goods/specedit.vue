<template>
  <Card>
  <Form :model="form" :label-width="120" :rules="rules" ref="form" style="width:50%;">
    <Form-item label="规格名称" prop="specname">
      <Input v-model="form.specname"></Input>
    </Form-item>
    <Form-item label="状态" prop="specstatus">
      <Select v-model="form.specstatus" style="width:200px">
        <Option v-for="item in statuslist" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
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
        specname: "",
        specstatus: 1,
        seq: 0,
        id: ""
      },
      prename: "ivc_spec",
      name: "ivcedit_spec",
      module: "ivc/spec",
      rules: {
        specname: [{ required: true, message: "请输入规格名称", trigger: "blur" }]
      }
    };
  }
};
</script>
