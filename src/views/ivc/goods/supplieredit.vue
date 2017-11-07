<template>
  <Card>
  <Form :model="form" :label-width="120" :rules="rules" ref="form" style="width:50%;">
     <Row>
                <Col span="12">
    <Form-item label="名称" prop="suppliername">
      <Input v-model="form.suppliername"></Input>
    </Form-item>
    </Col>
    <Col span="12">
    <Form-item label="地址" prop="address">
      <Input v-model="form.address"></Input>
    </Form-item>
    </Col>
    </Row>
    <Row>
                <Col span="12">
    <Form-item label="负责人" prop="chargename">
      <Input v-model="form.chargename"></Input>
    </Form-item>
    </Col>
    <Col span="12">
    <Form-item label="网址" prop="site">
      <Input v-model="form.site"></Input>
    </Form-item>
    </Col>
    </Row>
    <Row>
                <Col span="12">
    <Form-item label="电话" prop="mobile">
      <Input v-model="form.mobile"></Input>
    </Form-item>
    </Col>
    <Col span="12">
    <Form-item label="默认折扣" prop="rebate">
      <Input v-model="form.rebate"></Input>
    </Form-item>
    </Col>
    </Row>
    <Row>
                <Col span="12">
    <Form-item label="银行账户" prop="specname">
      <Input v-model="form.specname"></Input>
    </Form-item>
    </Col>
    <Col span="12">
    <Form-item label="银行账号" prop="bankno">
      <Input v-model="form.bankno"></Input>
    </Form-item>
    </Col>
    </Row>
    <Row>
                <Col span="12">
    <Form-item label="开户行" prop="bankname">
      <Input v-model="form.bankname"></Input>
    </Form-item>
    </Col>
    <Col span="12">
    <Form-item label="状态" prop="status">
      <Select v-model="form.status" style="width:200px">
        <Option v-for="item in statuslist" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    </Form-item>
    </Col>
    </Row>
    <Row>
                <Col span="12">
    <Form-item label="排序号：" prop="seq" >
      <Input v-model="form.seq"></Input>
    </Form-item>
    </Col>
    <Col span="12">
    <Form-item label="备注" prop="remark">
      <Input v-model="form.remark"></Input>
    </Form-item>
    </Col>
    </Row>
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
        suppliername: "",
        status: 1,
        address: "",
        chargename: "",
        mobile: "",
        site: "",
        rebate: 100,
        bankusername: "",
        bankno: "",
        bankname: "",
        remark: "",
        seq: 0,
        id: ""
      },
      prename: "ivc_supplier",
      name: "ivcedit_supplier",
      module: "ivc/supplier",
      rules: {
        suppliername: [{ required: true, message: "请输入名称", trigger: "blur" }]
      }
    };
  }
};
</script>
