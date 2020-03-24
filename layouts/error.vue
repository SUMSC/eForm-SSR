<template>
  <div class="container">
    <h1>
      {{ error.message }}
    </h1>
    <el-button v-if="hasToken">
      需要切换账号吗？
    </el-button>
  </div>
</template>

<script>
import { getToken } from '~/utils/cookies'

export default {
  name: 'Error',
  props: {
    error: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasToken () {
      return process.client && getToken()
    }
  }
}
</script>

<style scoped>
  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  h1 {
    margin-bottom: 30px;
  }
</style>
