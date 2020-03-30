<template>
  <div class="action-container">
    <div :class="{ 'avatar-container': true, 'avatar-pos': $store.state.mobile }">
      <img src="https://lg-holdyu6m-1256456369.cos.ap-shanghai.myqcloud.com/%E5%A4%B4%E5%83%8F5.png" alt="头像">
    </div>
    <div :class="{ action: true, 'action-pos': $store.state.mobile }">
      <el-button plain type="primary" @click="$store.commit('toggleLoginModal')">
        切换账号
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AvatarAction'
}
</script>

<style scoped>
  .avatar-container {
    position: fixed;
    right: 0;
    top: 0;
    width: 50px;
    height: 50px;
    background-color: white;
    padding-left: 3px;
    padding-top: 3px;
    border-radius: 5px;
    border: 2px solid #ebeef5;
    z-index: 10;
  }
  .avatar-container img {
    width: 40px;
    height: 40px;
  }
  .action {
    position: fixed;
    right: -50px;
    top: 5px;
    z-index: 5;
    transition: right .6s;
  }
  .action-container:hover .action {
    right: 50px;
  }
</style>
