<template>
  <div class="container">
    <header class="survey-header">
      <div id="title">
        <h1>{{ qnaire.name }}</h1>
      </div>
      <p>{{ qnaire.description }}</p>
    </header>
    <div class="paper">
      <div class="survey">
        <el-form ref="survey-form" :model="$store.state" class="survey-qnaire">
          <el-form-item
            v-for="(form, i) in qnaire.form"
            :key="i+1"
            :prop="'answer.' + i"
            :rules="[
              { required: form.required, message: '这道题还未回答', trigger: 'blur' }
            ]"
            inline-message
          >
            <component
              :is="form.type"
              :id="i"
              @clear="clearValidate"
            />
          </el-form-item>
          <el-form-item class="action-block">
            <el-button type="primary" class="submit-btn" @click="submit">
              提交
            </el-button>
            <el-button type="success" class="switch-btn" v-if="qnaire.a" @click="changeUser">
              切换账号
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <footer class="survey-footer">
      <p class="footer-copyright">
        Copyright © 2019-2020 SUMSC
      </p>
    </footer>
    <el-dialog
      title="登陆"
      :visible.sync="showModal"
      :show-close="isSwitch"
      :close-on-click-modal="isSwitch"
      :close-on-press-escape="isSwitch"
      center
      :before-close="handleClose"
    >
      <el-form :model="loginForm">
        <el-form-item prop="id" label="学号">
          <el-input v-model="loginForm.id" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="loginForm.password" type="password" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="login">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { QuestionComponents } from '@/components'
import { getServerToken } from '~/utils/cookies'

export default {
  components: {
    ...QuestionComponents
  },
  fetch (context) {
    if (context.store.state.token.length > 0) {
      return context.store.dispatch('getUserInfo').then((res) => {
        const answer = res.my_answer
        const hasAnswered = _.find(answer, { qnaire_id: context.store.state.id }) !== undefined
        if (hasAnswered) {
          context.error({ statusCode: 400, message: '这个问卷你已经做过了哦' })
        }
      })
    }
  },
  asyncData (context) {
    if (process.server) {
      const id = Number(context.params.answer)
      const token = getServerToken(context.req)
      context.store.commit('setID', id)
      context.store.commit('setToken', token)
      return context.store.dispatch('getQnaire').catch(() => {
        console.log('not found qnaire')
        context.error({ statusCode: 404, message: '问卷不存在' })
      })
    }
  },
  data () {
    return {
      loginForm: {
        id: '',
        password: ''
      },
      isSwitch: false
    }
  },
  computed: {
    showModal () {
      return this.$store.state.showLoginModal
    },
    qnaire () {
      return this.$store.state.qnaire
    }
  },
  validate ({ params, error }) {
    if (!params.answer || params.answer.length === 0) {
      console.log('invalid query')
      error({ statusCode: 404, message: '问卷不存在' })
    }
    return true
  },
  created () {
    //
  },
  mounted () {
    if (!this.$store.state.token) {
      this.$store.commit('toggleLoginModal')
    }
  },
  methods: {
    login () {
      this.$store.dispatch('login', this.loginForm).then((res) => {
        const answer = res.my_answer
        const hasAnswered = _.find(answer, { qnaire_id: this.$store.state.id }) !== undefined
        if (hasAnswered) {
          this.$nuxt.error({ statusCode: 400, message: '这个问卷你已经做过了哦' })
        }
      })
    },
    submit () {
      // eslint-disable-next-line no-console
      console.log(this.$store.state.answer)
      this.$refs['survey-form'].validate((valid) => {
        if (valid) {
          this.$confirm('确认要提交了吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '再看看',
            type: 'info'
          }).then(() => {
            this.$store.dispatch('submitAnswer')
          })
          return true
        } else {
          return false
        }
      })
    },
    clearValidate (prop) {
      this.$refs['survey-form'].clearValidate(prop)
    },
    changeUser () {
      this.isSwitch = true
      this.$store.commit('toggleLoginModal')
    },
    handleClose (done) {
      this.$store.commit('toggleLoginModal')
      this.isSwitch = false
      done()
    }
  }
}
</script>

<style scoped>
  .container {
    min-height: 100vh;
    width: 920px;
    margin: 0 auto;
  }
  .paper {
    background-color: white;
    width: 100%;
    padding-top: 30px;
    margin-bottom: 30px;
    /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)*/
  }
  .survey {
    width: 780px;
    margin: 0 auto;
  }
  .survey-header {
    padding: 72px 72px 48px;
  }
  #title {
    position: relative;
  }
  .survey-header h1 {
    color: black;
    font-weight: normal;
    vertical-align: middle;
    text-align: center;
    padding: 15px 0;
    line-height: 30px;
    font-size: 30px;
  }
  .survey-header p {
    color: #606266;
    line-height: 24px;
    text-align: center;
    font-size: 16px;
    padding-bottom: 15px;
    margin-left: 0;
    margin-top: 20px;
  }
  .qrcode {
    width: 50px;
    height: 50px;
    background-color: gray;
    position: absolute;
    right: -10px;
    top: 6px;
  }
  .survey-qnaire {
    padding-bottom: 40px;
  }
  .survey-footer {
    margin: 50px;
  }
  .footer-copyright {
    text-align: center;
    color: #a9a9a9;
    font-size: 14px;
  }
  .submit-btn {
    width: 180px;
  }
  .action-block {
    margin-top: 50px;
    display: flex;
    justify-content: center;
  }
</style>

<style>
  .el-dialog {
    min-width: 20em !important;
    max-width: 30em !important;
  }
  .el-input {
    width: 80%;
  }
</style>
