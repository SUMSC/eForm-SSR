<template>
  <el-dialog
    :title="title"
    :visible.sync="showModal"
    :show-close="isSwitch"
    :close-on-click-modal="isSwitch"
    :close-on-press-escape="isSwitch"
    center
    :before-close="handleClose"
  >
    <el-form ref="loginForm" class="login-form" :model="loginForm" :rules="loginFormRules">
      <el-form-item prop="id">
        <el-input v-model="loginForm.id" placeholder="填写你的学号" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="填写你的密码" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="login">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'LoginDialog',
  props: {
    isSwitch: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '登陆'
    }
  },
  data () {
    return {
      loginForm: {
        id: '',
        password: ''
      },
      loginFormRules: {
        id: [{ required: true, message: '学号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showModal () {
      return this.$store.state.showLoginModal
    }
  },
  methods: {
    handleClose (done) {
      this.$store.commit('toggleLoginModal')
      done()
    },
    login () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch('login', this.loginForm).then((res) => {
            const answer = res.my_answer
            if (this.$store.state.qnaire.settings.only_once) {
              const hasAnswered = _.find(answer, { qnaire_id: this.$store.state.id }) !== undefined
              if (hasAnswered) {
                this.$nuxt.error({ statusCode: 400, message: '这个问卷你已经做过了哦' })
              }
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.login-form {
  max-width: 20em;
}
</style>

<style>
  .el-dialog {
    max-width: 20em;
  }
</style>
