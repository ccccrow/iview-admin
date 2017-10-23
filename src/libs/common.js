export const deleteButton = (vm,h,currentRow, index) =>{
    return h(
      "Poptip", {
        props: {
          confirm: true,
          title: "您确定要删除这条数据吗?",
          transfer: true
        },
        on: {
          "on-ok": () => {
            vm.deleteData(currentRow.id);
          }
        }
      }, [
        h(
          "Button", {
            style: {
              marginLeft: "10px"
            },
            props: {
              type: "error",
              size: "small"
            }
          },
          "删除"
        )
      ]
    );
}
export const  editButton = (vm, h, param, item) => {
  return h(
    "Button", {
      style: {
        marginLeft: "10px"
      },
      props: {
        type: "primary",
        size: "small"
      },
      on: {
        "click": (e)=>{
          vm.edit({"id":param.id});
        }
      }
    },
    "编辑"
  )
}
export const finishEdit = (vm,name)=>{
  vm.$store.commit('removeTag', name);
  vm.$router.push({
      name:vm.prename
  });
}