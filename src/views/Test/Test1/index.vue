<template>
  <div>
    <el-button type="primary" v-show="$store.state.user.button.indexOf('btn.Add1') != -1">添加按钮1</el-button>
    <el-button type="primary" v-show="$store.state.user.button.indexOf('btn.Add2') != -1">添加按钮2</el-button>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>