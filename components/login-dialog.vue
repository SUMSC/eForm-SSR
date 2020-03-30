<template>
  <el-dialog
    v-if="!mobile"
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
      <el-button type="primary" @click="handleLogin">确 定</el-button>
    </span>
  </el-dialog>
  <van-popup v-else v-model="showModal" class="mobile-login-form" :close-on-click-overlay="false">
    <van-form @submit="handleLogin">
      <h3 class="mobile-login-form__title">
        苏大统一身份认证
      </h3>
      <van-field
        v-model="loginForm.id"
        name="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '学号不能为空' }]"
      />
      <van-field
        v-model="loginForm.password"
        type="password"
        name="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '密码不能为空' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          登陆
        </van-button>
      </div>
    </van-form>
  </van-popup>
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
    showModal: {
      get () {
        return this.$store.state.showLoginModal
      },
      set () {
        (() => {})()
      }
    },
    mobile () {
      return this.$store.state.mobile
    }
  },
  methods: {
    handleClose (done) {
      this.$store.commit('toggleLoginModal')
      done()
    },
    login () {
      this.$store.dispatch('login', this.loginForm).then((res) => {
        const answer = res.my_answer
        if (this.$store.state.qnaire.settings.only_once) {
          const hasAnswered = _.find(answer, { qnaire_id: this.$store.state.id }) !== undefined
          if (hasAnswered) {
            this.$nuxt.error({ statusCode: 400, message: '这个问卷你已经做过了哦' })
          }
        }
      })
    },
    handleLogin () {
      if (!this.mobile) {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.login()
            return true
          }
          return false
        })
      } else {
        this.login()
      }
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
  .mobile-login-form {
    width: 20rem;
  }
  .mobile-login-form__title {
    font-size: 1.2rem;
    text-align: center;
    margin: 20px;
    color: #303133;
  }
</style>
