<template>
  <Card>
  <Form :model="form" :label-width="120" :rules="rules" ref="form" style="width:50%;">
    <Form-item label="角色名称：" prop="rolename">
      <Input v-model="form.rolename"></Input>
    </Form-item>
    <Form-item label="角色代码：" prop="rolecode">
      <Input v-model="form.rolecode"></Input>
    </Form-item>
    <Form-item label="角色描述：" prop="roledesc">
      <Input v-model="form.roledesc" type="textarea"></Input>
    </Form-item>
    <Form-item>
  <Button type="primary" @click.native="submitData" :loading="save_loading">保存</Button>
  <Button type="ghost" @click.native="finishEdit('sys_role')" style="margin-left:15px;">取消</Button>
    </Form-item>
  </Form>
  </Card>
</template>
<script>
import Mixin from "../../libs/mixindata";
import Bus from "../../libs/bus";
export default {
  mixins: [Mixin],
  data() {
    return {
      form: {
        rolename: "",
        rolecode: "",
        roledesc: "",
        id: ""
      },
      prename: "sys_role",
      name: "sysedit_role",
      module: "role",
      rules: {
        rolename: [{ required: true, message: "请输入角色名称", trigger: "blur" }]
      }
    };
  }
};
</script>
