<template>
  <Card>
  <Form :model="form" :label-width="120" :rules="rules" ref="form" style="width:50%;">
    <Form-item label="名称" prop="spectypename">
      <Input v-model="form.spectypename"></Input>
    </Form-item>
    <Form-item label="状态" prop="specstatus">
      <Select v-model="form.spectypestatus" style="width:200px">
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
  created() {
    this.form.specid = this.$route.params.specid;
  },
  data() {
    return {
      form: {
        spectypename: "",
        spectypestatus: 1,
        seq: 0,
        specid : 0,
        id: ""
      },
      prename: "ivcspec_type",
      name: "ivcedit_spectype",
      module: "ivc/specType",
      rules: {
        spectypename: [{ required: true, message: "请输入名称", trigger: "blur" }]
      }
    };
  }
};
</script>
