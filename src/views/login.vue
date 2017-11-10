<style lang="less">
@import "./login.less";
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎
                </p>
                <div class="form-con" v-if="reg==false">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="username">
                            <Input v-model="form.username">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input v-model="form.password" type="password">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" :loading="save_loading">登录</Button>
                            <Button @click="showReg" type="primary">注册</Button>
                        </FormItem>
                    </Form>
                </div>
                <div class="form-con"  v-if="reg==true">
                    <Form ref="regForm" :model="regform" :rules="regrules">
                        <FormItem prop="companyname">
                            <Input v-model="regform.companyname" placeholder="公司名称">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="realname">
                            <Input v-model="regform.realname" placeholder="如何称呼您1">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="mobile">
                            <Input v-model="regform.mobile" placeholder="手机号码">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="regpassword">
                            <Input v-model="regform.regpassword" type="password" placeholder="密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="regpassword1">
                            <Input v-model="regform.regpassword1" type="password" placeholder="再次输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="reg=false" type="primary">返回登录</Button>
                            <Button @click="handleReg" type="primary" :loading="save_loading">提交</Button>

                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.regform.regpassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      reg:false,
      save_loading:false,
      form: {
        username: "admin",
        password: ""
      },
      regform:{
        companyname: "",
        realname:"",
        mobile:"",
        regpassword: "",
        password:"",
        regpassword1:""
      },
      rules: {
        username: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      },
      regrules:{
        companyname: [{ required: true, message: "公司名称不能为空", trigger: "blur" }],
        realname: [{ required: true, message: "您的称呼不能为空", trigger: "blur" }],
        mobile: [{ required: true, message: "手机号码不能为空", trigger: "blur" }],
        regpassword: [{ required: true, message: "密码不能为空", trigger: "blur" }],
        regpassword1: [
          { required: true, validator: validatePass, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    showReg(){
      this.reg = true;  
    },
    handleReg(){
      this.$refs.regForm.validate(valid => {
        if (valid) {
          this.save_loading = true;
          this.regform.password =  this.form.regpassword;
          this.$http
            .post( "ivc/company/reg", this.regform)
            .then(response => {
              if (response.data.h.c == "0") {
                  this.$Message.success("注册成功");
                  this.reg= false;
              } else {
                this.$Message.error(response.data.h.m);
              }
              this.save_loading = false;
            });
        }
      });
    },
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.save_loading = true;
          this.$http
            .post( "user/login", {
              username: this.form.username,
              password: this.form.password
            })
            .then(response => {
              if (response.data.h.c == "0") {
                Cookies.set(
                  "user",
                  JSON.stringify(response.data.b.user)
                );
                Cookies.set("token", response.data.h.token);
                Cookies.set("r", response.data.b.user.resources);
                this.$router.push({
                  name: "home_index"
                });
              } else {
                this.$Message.error(response.data.h.m);
              }
              this.save_loading = false;
            });
          this.$store.commit(
            "setAvator",
            "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg"
          );
          
        }
      });
    }
  }
};
</script>

<style>

</style>
