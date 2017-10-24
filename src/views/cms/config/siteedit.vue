<template>
  <Card>
    <Form :model="form" :label-width="120" :rules="rules" ref="form">
      <Row>
        <Col span="12">
          <FormItem label="站点名称：" prop="sitename">
            <Input v-model="form.sitename"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="站点简称：">
            <Input v-model="form.sitesimple"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="关键词：">
            <Input type="textarea" v-model="form.keywords"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="描述：">
            <Input type="textarea" v-model="form.desciption"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="域名：">
            <Input v-model="form.domain"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="站点访问路径：">
            <Input v-model="form.visitpath"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="访问协议：">
            <Select v-model="form.protocl"></Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="是否开启静态：">
            <i-switch v-model="form.isstatic">
                <span slot="open">是</span>
                <span slot="close">否</span>
            </i-switch>
        </FormItem>
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
export default {
  mixins: [Mixin],
  data () {
    return {
      form: {
        sitename: '',
        sitesimple: '',
        id: '',
        keywords: '',
        desciption: '',
        domain: '',
        visitpath: '',
        protocl: '',
        isstatic: '',
        status: ''
      },
      prename: "cms_site",
      name: "cmsedit_site",
      module: "cms/site",
      rules: {
        sitename: [{ required: true, message: "请输入站点名称", trigger: "blur" }]
      }
    }
  }
}
</script>
