/**
 * Created by yk on 2017/2/13.
 */
import Bus from "./bus.js";
import Cookies from "js-cookie";
export default {
  data(){
    return {
      modstatus:false,
      save_loading:false,
      statuslist: [
        {
          value: 1,
          label: '启用'
        },
        {
          value: 0,
          label: '停用'
        }
      ]
    }
  },
  computed:{
    getDataValue(){
      return 'get'+this.module
    },
    callbackDataValue(){
      return 'callback'+this.module
    },
    saveaction(){
      return this.module+"/save"
    },
    getaction(){
      return this.module+"/query/"
    }
  },
  methods: {
    getUser () {
      return JSON.parse(Cookies.get("user"))
    },
    finishEdit(){
      this.$store.commit('removeTag', this.name);
      this.$router.push({
          name: this.prename
      });
    },
    submitData() {
      var $this = this;
      $this.$refs.form.validate((valid) => {
        if (valid) {
          $this.save_loading = true;
          $this.$http.post( $this.saveaction, $this.form)
            .then((response) => {
              var c = response.data.h.c;
              if (c == "0") {
                $this.$Message.success(response.data.h.m);
                Bus.$emit(this.getDataValue);
                $this.finishEdit();
              } else {
                $this.$Message.error(response.data.h.m);
              }
              $this.save_loading = false;
            })
        } else {
          return false;
        }
      });
    },
    getData: function (id) {
      var $this = this;
      $this.$http.post( $this.getaction + id)
        .then((response) => {
          let data =  response.data.b;
          for(let key in data){
            if(key in $this.form){
              $this.form[key] = data[key];
            }
          }
          Bus.$emit(this.callbackDataValue,data);
        })
    }
  },
  mounted () {
    var params = this.$route.params;
    if(params.id!="new"){
      this.getData(params.id);
      this.modstatus = true;
    }else{
      this.modstatus = false;
    }
    if(this.getDataCallback){
      this.getDataCallback(params);
    }
  }
}
