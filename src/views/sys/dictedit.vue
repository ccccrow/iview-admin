<template>
  <Card>
  <Form :model="form" :label-width="80" :rules="rules" ref="form" style="width:50%;">
    <Form-item label="字典名称" prop="name">
      <Input v-model="form.name"></Input>
    </Form-item>
    <Form-item label="字典编码" prop="code">
      <Input v-model="form.code"></Input>
    </Form-item>
    <Form-item label="字典值" prop="value">
       <Input v-model="form.value" type="textarea"></Input>
    </Form-item>
    <Form-item label="排序号" prop="sort" >
      <Input v-model="form.sort"></Input>
    </Form-item>
    <Form-item>
  <Button type="primary" @click.native="submitData">保存</Button>
  <Button type="ghost" @click.native="finishEdit('sys_dict')" style="margin-left:15px;">取消</Button>
    </Form-item>
  </Form>
  </Card>
</template>
<script>
import Mixin from "../../libs/mixindata";
import Bus from "../../libs/bus";
export default {
  mixins: [Mixin],
  methods: {
    getDataCallback(params){
      this.form.parentid = params.parentid;
    }
  },
  data() {
    var $this = this;
    var validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入字典编码"));
      } else {
        this.$http
          .post("dict/query/list", {
            code: value
          })
          .then(response => {
            if (response.data.b.length != 0) {
              var user = response.data.b[0];
              if (user.id != this.form.id) {
                callback(new Error("字典编码重复"));
              } else {
                callback();
              }
            } else {
              callback();
            }
          });
      }
    };
    return {
      form: {
        name: "",
        code: "",
        value: "",
        sort: 0,
        id: "",
        parentid: "0"
      },
      prename: "sys_dict",
      name: "sysedit_dict",
      module: "dict",
      rules: {
        name: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
        code: [
          { required: true, validator: validateCode, trigger: "blur" }
        ]
      }
    };
  }
};
</script>
