<template>
  <Card>
  <Form :model="form" :label-width="80" :rules="rules" ref="form" style="width:50%;">
    <Form-item label="机构名称" prop="orgname">
      <Input v-model="form.orgname"></Input>
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
    return {
      form: {
        orgname: "",
        sort: 0,
        id: "",
        parentid: "0"
      },
      name: "sysedit_org",
      module: "org",
      rules: {
        orgname: [{ required: true, message: "请输入机构名称", trigger: "blur" }]
      }
    };
  }
};
</script>
