<template>
  <Card>
  <Form :model="form" :label-width="120" :rules="rules" ref="form" style="width:50%;">
    <Form-item label="姓名" prop="realname">
      <Input v-model="form.realname"></Input>
    </Form-item>
    <Form-item label="手机号码" prop="mobile" >
      <Input v-model="form.mobile"></Input>
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
        realname: "",
        mobile: "",
        id: ""
      },
      prename: "ivc_member",
      name: "ivcedit_member",
      module: "ivc/member",
      rules: {
        realname: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      }
    };
  }
};
</script>
