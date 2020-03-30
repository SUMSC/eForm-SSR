<template>
  <div>
    <div v-if="!mobile" class="container">
      <header class="survey-header">
        <div id="title">
          <h1>{{ qnaire.name }}</h1>
        </div>
        <p>{{ qnaire.description }}</p>
        <avatar-action v-if="!qnaire.a" />
      </header>
      <div class="paper">
        <div class="survey">
          <el-form ref="survey-form" :model="$store.state" class="survey-qnaire">
            <el-form-item
              v-for="(form, i) in qnaire.form"
              :key="i+1"
              :prop="'answer.' + i"
              :rules="form.type !== 'plain-text' ? [
                { required: form.required, message: '这道题还未回答', trigger: 'blur' }
              ]: []"
              inline-message
            >
              <component
                :is="form.type"
                :id="i"
                @clear="clearValidate"
              />
            </el-form-item>
            <el-form-item class="action-block">
              <el-button type="primary" class="submit-btn" :disabled="!qnaire.active" @click="submit">
                提交
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
    </div>
    <MobileAnswer v-else @submit="submit" />
    <LoginDialog :title="loginFormTitle" />
  </div>
</template>

<script>
import _ from 'lodash'
import { QuestionComponents, AvatarAction, LoginDialog } from '@/components'
import { getServerToken } from '~/utils/cookies'
import { deleteFile } from '~/utils/requests'
import MobileAnswer from '~/components/mobile-answer.vue'

export default {
  components: {
    ...QuestionComponents,
    AvatarAction,
    LoginDialog,
    MobileAnswer
  },
  fetch (context) {
    if (process.server) {
      const ua = context.req ? context.req.headers['user-agent'] : navigator.userAgent || ''
      context.store.commit('setMobile', !!ua.match(/AppleWebKit.*Mobile.*/))
      if (context.store.state.token.length > 0) {
        return context.store.dispatch('getUserInfo').then((res) => {
          const answer = res.my_answer
          const hasAnswered = _.find(answer, { qnaire_id: context.store.state.id }) !== undefined
          const isOwner = _.find(res.my_qnaire, { id: context.store.state.id }) !== undefined
          context.store.commit('changeRole', isOwner ? 'owner' : 'guest')
          return { isOwner, hasAnswered }
        }).then(({ isOwner, hasAnswered }) => {
          return context.store.dispatch('getQnaire').then((res) => {
            if (!res.active && !isOwner) {
              context.error({ statusCode: 403, message: '问卷尚未发布，没有权限预览' })
            }
            if (hasAnswered && !isOwner && res.settings.only_once) {
              context.error({ statusCode: 400, message: '这个问卷你已经做过了哦' })
            }
          }).catch(() => {
            context.error({ statusCode: 404, message: '问卷不存在' })
          })
        })
      } else {
        return context.store.dispatch('getQnaire').then((res) => {
          if (!res.active) {
            context.error({ statusCode: 403, message: '问卷尚未发布，没有权限预览' })
          }
        }).catch(() => {
          context.error({ statusCode: 404, message: '问卷不存在' })
        })
      }
    }
  },
  asyncData (context) {
    if (process.server) {
      const id = Number(context.params.answer)
      const token = getServerToken(context.req)
      context.store.commit('setID', id)
      context.store.commit('setToken', token)
    }
  },
  data () {
    return {
      isSwitch: false,
      loginFormTitle: '登陆'
    }
  },
  computed: {
    showModal () {
      return this.$store.state.showLoginModal
    },
    qnaire () {
      return this.$store.state.qnaire
    },
    mobile () {
      return this.$store.state.mobile
    }
  },
  created () {
    if (process.client && !this.qnaire.active) {
      this.$nextTick(() => {
        this.$notify.info({
          title: '提示',
          message: '当前为答卷预览，无法提交',
          duration: 0,
          position: 'bottom-right'
        })
      })
    }
  },
  mounted () {
    if (!this.$store.state.token && !this.qnaire.a) {
      this.$store.commit('toggleLoginModal')
    }
    window.onbeforeunload = () => {
      this.$store.state.files.forEach((file) => {
        deleteFile(file)
      })
    }
  },
  methods: {
    login () {
      this.$store.dispatch('login', this.loginForm).then((res) => {
        const answer = res.my_answer
        if (this.qnaire.settings.only_once) {
          const hasAnswered = _.find(answer, { qnaire_id: this.$store.state.id }) !== undefined
          if (hasAnswered) {
            this.$nuxt.error({ statusCode: 400, message: '这个问卷你已经做过了哦' })
          }
        }
      })
    },
    submit () {
      // eslint-disable-next-line no-console
      console.log(this.$store.state.answer)
      if (!this.$store.state.mobile) {
        this.$refs['survey-form'].validate((valid) => {
          if (valid) {
            this.$confirm('确认要提交了吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '再看看',
              type: 'info'
            }).then(() => {
              this.$store.dispatch('submitAnswer').then(() => {
                this.$router.push('/success')
              })
            })
            return true
          } else {
            return false
          }
        })
      } else {
        this.$store.dispatch('submitAnswer').then(() => {
          this.$router.push('/success')
        })
      }
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
  },
  head () {
    return {
      title: `${this.qnaire.name} - eForm`,
      meta: [{
        name: 'keywords',
        content: '调查问卷'
      }, {
        name: 'description',
        content: this.qnaire.description
      }]
    }
  },
  validate ({ params, error }) {
    if (!params.answer || params.answer.length === 0) {
      error({ statusCode: 404, message: '问卷不存在' })
    }
    return true
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
