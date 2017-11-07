<template>
  <Card>
  <Form :model="form" :label-width="120" :rules="rules" ref="form" style="width:50%;">
    <Form-item label="名称" prop="storename">
      <Input v-model="form.storename"></Input>
    </Form-item>
    <Form-item label="类型" prop="storetype">
      <Select v-model="form.storetype" style="width:200px">
        <Option v-for="item in storetypelist" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    </Form-item>
    <Form-item label="状态" prop="storestatus">
      <Select v-model="form.storestatus" style="width:200px">
        <Option v-for="item in statuslist" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    </Form-item>
    <Form-item label="排序号：" prop="seq" >
      <Input v-model="form.seq"></Input>
    </Form-item>
    <Form-item label="备注" prop="remark">
      <Input v-model="form.remark" type="textarea"></Input>
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
        storename: "",
        storestatus: 1,
        storetype: 1,
        seq: 0,
        id: "",
        remark:""
      },
      storetypelist: [
        {
          value: 1,
          label: '仓库'
        },
        {
          value: 0,
          label: '门店'
        }
      ],
      prename: "ivc_store",
      name: "ivcedit_store",
      module: "ivc/store",
      rules: {
        storename: [{ required: true, message: "请输入名称", trigger: "blur" }]
      }
    };
  }
};
</script>
