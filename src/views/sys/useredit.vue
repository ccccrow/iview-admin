<template>
  <Card>
  <Form :model="form" :label-width="80" :rules="rules" ref="form" style="width:50%;">
    <Form-item label="用户名" prop="username">
      <Input v-model="form.username"></Input>
    </Form-item>
    <Form-item label="姓名" prop="realname">
      <Input v-model="form.realname"></Input>
    </Form-item>
    <Form-item label="手机号码" prop="mobile">
      <Input v-model="form.mobile"></Input>
    </Form-item>
    <Form-item label="密码" prop="password" v-if="!modstatus">
      <Input v-model="form.password" type="password"></Input>
    </Form-item>
    <Form-item label="确认密码" prop="password1" v-if="!modstatus">
      <Input v-model="form.password1" type="password"></Input>
    </Form-item>
    <Form-item label="所属机构">
      <Cascader :data="options" :value="orgArr" change-on-select @on-change="orgTreeChange"></Cascader>
    </Form-item>
    <Form-item>
  <Button type="primary" @click.native="submitData">保存</Button>
  <Button type="ghost" @click.native="finishEdit('sys_user')" style="margin-left:15px;">取消</Button>
    </Form-item>
  </Form>
  </Card>
</template>
<script>
import Mixin from "../../libs/mixindata";
import Bus from "../../libs/bus";
export default {
  mixins: [Mixin],
  created() {
    Bus.$on(this.callbackDataValue, data => {
      if (data.orgids) {
        this.orgArr = data.orgids.split(",");
      }
    });
  },
  computed: {
    options(){
      return this.$store.state.orgList;
    }
  },
  methods: {
    orgTreeChange: function(val) {
      this.form.orgids = val.join(",");
      this.form.orgid = val[val.length-1];
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        this.$http
          .post("user/query/list", { username: value })
          .then(response => {
            if (response.data.b.length != 0) {
              var user = response.data.b[0];
              if (user.id != this.form.id) {
                callback(new Error("用户名重复"));
              } else {
                callback();
              }
            } else {
              callback();
            }
          });
      }
    };
    var validateMobile = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        this.$http.post("user/query/list", { mobile: value }).then(response => {
          if (response.data.b.length != 0) {
            var user = response.data.b[0];
            if (user.id != this.form.id) {
              callback(new Error("手机号码重复"));
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
        username: "",
        realname: "",
        password: "",
        mobile: "",
        password1: "",
        id: "",
        orgid: 0,
        orgids: ""
      },
      orgArr: [],
      name: "sysedit_user",
      prename: "sys_user",
      module: "user",
      rules: {
        username: [
          { required: true, validator: validateUsername, trigger: "blur" }
        ],
        orgid: [{ required: true, trigger: "blur" }],
        realname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        mobile: [
          { required: true, validator: validateMobile, trigger: "blur" },
          { max: 11, message: "手机号码不能大于11位", trigger: "blur" }
        ],
        password1: [
          { required: true, validator: validatePass, trigger: "blur" }
        ]
      }
    };
  }
};
</script>
