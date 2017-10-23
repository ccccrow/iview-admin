<template>
  <Card>
  <Form :model="form" :label-width="80" :rules="rules" ref="form" style="width:50%;">
    <Form-item label="资源名称" prop="resourcename">
      <Input v-model="form.resourcename"></Input>
    </Form-item>
    <Form-item label="资源编码" prop="resourcecode">
      <Input v-model="form.resourcecode"></Input>
    </Form-item>
    <Form-item label="资源类型" prop="resourcetype">
      <Select v-model="form.resourcetype" style="width:200px">
        <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    </Form-item>
    <Form-item label="排序号" prop="sort" >
      <Input v-model="form.sort"></Input>
    </Form-item>
    <Form-item>
  <Button type="primary" @click.native="submitData">保存</Button>
  <Button type="ghost" @click.native="finishEdit" style="margin-left:15px;">取消</Button>
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
    var validateResource = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入资源编码"));
      } else {
        this.$http
          .post("resource/query/list", {
            resourcecode: value
          })
          .then(response => {
            if (response.data.b.length != 0) {
              var user = response.data.b[0];
              if (user.id != this.form.id) {
                callback(new Error("资源编码重复"));
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
        resourcename: "",
        resourcecode: "",
        resourcetype: "",
        sort: 0,
        id: "",
        parentid: "0"
      },
      options: [
        {
          value: "action",
          label: "操作"
        },
        {
          value: "menu",
          label: "菜单"
        }
      ],
      name: "sysedit_resource",
      module: "resource",
      rules: {
        resourcename: [{ required: true, message: "请输入资源名称", trigger: "blur" }],
        resourcecode: [
          { required: true, validator: validateResource, trigger: "blur" }
        ],
        resourcetype: [{ required: true, message: "请选择资源类型", trigger: "blur" }]
      }
    };
  }
};
</script>
