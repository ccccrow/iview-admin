<style lang="less">
@import "./own-space.less";
</style>
<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                个人信息
            </p>
            <div>
                <Form 
                    ref="form"
                    :model="form" 
                    :label-width="100" 
                    label-position="right"
                    :rules="rules" >
                    <FormItem label="用户姓名：" prop="realname">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="form.realname" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="手机号码：" prop="mobile" >
                        <div style="display:inline-block;width:204px;">
                            <Input v-model="form.mobile"></Input>
                        </div>
                    </FormItem>
                    <Form-item label="所属机构">
                         <div style="display:inline-block;width:204px;">
                    <Cascader :data="options" :value="orgArr" change-on-select @on-change="orgTreeChange"></Cascader>
                         </div>
                    </Form-item>
                    <FormItem label="登录密码：">
                        <Button type="text" size="small" @click="showEditPassword">修改密码</Button>
                    </FormItem>
                    <div>
                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
                        <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
                    </div>
                </Form>
            </div>
        </Card>
        <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <FormItem label="原密码" prop="oldpassword" :error="oldPassError">
                    <Input v-model="editPasswordForm.oldpassword" type="password" placeholder="请输入现在使用的密码" ></Input>
                </FormItem>
                <FormItem label="新密码" prop="password">
                    <Input v-model="editPasswordForm.password" type="password" placeholder="请输入新密码，至少6位字符" ></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="password1">
                    <Input v-model="editPasswordForm.password1" type="password" placeholder="请再次输入新密码" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelEditPass">取消</Button>
                <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
  name: "own-space",
  data() {
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
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      orgArr: [],
      form: {
        username: "",
        realname: "",
        mobile: "",
        orgid: 0,
        id: "",
        orgids: ""
      },
      save_loading: false,
      editPasswordModal: false, // 修改密码模态框显示
      savePassLoading: false,
      oldPassError: "",
      rules: {
        realname: [{ required: true, message: "请输入用户姓名", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入手机号码" },
          { validator: validateMobile }
        ]
      },
      editPasswordForm: {
        oldpassword: "",
        password: "",
        password1: ""
      },
      passwordValidate: {
        oldpassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "请至少输入6个字符", trigger: "blur" },
          { max: 32, message: "最多输入32个字符", trigger: "blur" }
        ],
        password1: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: valideRePassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    showEditPassword() {
      this.editPasswordModal = true;
    },
    cancelEditUserInfor() {
      this.$store.commit("removeTag", "ownspace_index");
      localStorage.pageOpenedList = JSON.stringify(
        this.$store.state.pageOpenedList
      );
      let lastPageName = "";
      if (this.$store.state.pageOpenedList.length > 1) {
        lastPageName = this.$store.state.pageOpenedList[1].name;
      } else {
        lastPageName = this.$store.state.pageOpenedList[0].name;
      }
      this.$router.push({
        name: lastPageName
      });
    },
    saveEdit() {
      var $this = this;
      $this.$refs.form.validate(valid => {
        if (valid) {
            $this.save_loading=true;
          $this.$http.post("user/save", $this.form).then(response => {
            var c = response.data.h.c;
            if (c == "0") {
              $this.$Message.success(response.data.h.m);
            } else {
              $this.$Message.error(response.data.h.m);
            }
            $this.save_loading=false;
          });
        } else {
          return false;
        }
      });
    },
    cancelEditPass() {
      this.editPasswordModal = false;
    },
    saveEditPass() {
        let $this = this;
      this.$refs["editPasswordForm"].validate(valid => {
        if (valid) {
          this.savePassLoading = true;
          $this.$http
            .post("user/modpassword", this.editPasswordForm)
            .then(response => {
              var c = response.data.h.c;
              if (c == "0") {
                $this.$Message.success(response.data.h.m);
                $this.editPasswordModal = false;
              } else {
                $this.$Message.error(response.data.h.m);
              }
              this.savePassLoading = false;
            });
        }
      });
    },
    orgTreeChange: function(val) {
      this.form.orgids = val.join(",");
      this.form.orgid = val[val.length - 1];
    }
  },
  computed: {
    options() {
      return this.$store.state.orgList;
    }
  },
  mounted() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    this.form.id = user.id;
    this.form.username = user.username;
    this.form.realname = user.realname;
    this.form.orgid = user.orgid;
    this.form.orgids = user.orgids;
    this.form.mobile = user.mobile;
    this.orgArr = user.orgids.split(",");
  }
};
</script>
