<template>
  <div class="mobile-container">
    <header class="survey-header">
      <h2>{{ qnaire.name }}</h2>
      <p>{{ qnaire.description }}</p>
      <avatar v-if="!qnaire.a" />
    </header>
    <main>
      <van-form
        ref="m-survey-form"
      >
        <van-cell-group v-for="(form, i) in qnaire.form" :key="i+1" class="m-survey-block">
          <component :is="form.type" :id="i" />
        </van-cell-group>
        <div style="margin: 0 3rem 1rem;">
          <van-button round block type="info" @click="handleSubmit">
            提交
          </van-button>
        </div>
      </van-form>
    </main>
  </div>
</template>

<script>
import { Notify } from 'vant'
import findIndex from 'lodash/findIndex'
import Avatar from './avatar'
import AreaPicker from './question-components/area-picker.vue'
import DatePicker from './question-components/date-picker.vue'
import FileUploader from './question-components/file-uploader.vue'
import PlainText from './question-components/plain-text.vue'
import QnaireInput from './question-components/qnaire-input.vue'
import QnaireCheckbox from './question-components/qnaire-checkbox.vue'
import QnaireSelect from './question-components/qnaire-select.vue'
import QnaireTextarea from './question-components/qnaire-textarea.vue'

export default {
  name: 'MobileAnswer',
  components: {
    Avatar,
    AreaPicker,
    DatePicker,
    FileUploader,
    PlainText,
    QnaireInput,
    QnaireCheckbox,
    QnaireSelect,
    QnaireTextarea
  },
  computed: {
    qnaire () {
      return this.$store.state.qnaire
    },
    answer () {
      return this.$store.state.answer
    }
  },
  methods: {
    handleSubmit () {
      const valid = this.qnaire.form.map((f, i) => {
        if (f.type === 'plain-text' || !f.required) {
          return true
        } else if (f.type === 'qnaire-select' || f.type === 'date-picker') {
          return typeof this.answer[i] !== 'string'
        } else {
          return !!this.answer[i].length
        }
      })
      const invalidIndex = findIndex(valid, i => i === false)
      if (invalidIndex !== -1) {
        Notify({ type: 'primary', message: `提交失败，第 ${invalidIndex + 1} 题未回答` })
      } else {
        this.$emit('submit')
      }
    }
  }
}
</script>

<style scoped>
.survey-header {
  max-width: 15rem;
  margin: 2rem auto;
}
.survey-header h2 {
  margin: 0 auto 1rem;
  max-width: 10em;
  font-size: 20px;
  text-wrap: revert;
  text-align: center;
}
.m-survey-block {
  margin-bottom: 1.5rem;
}
</style>
<style>
.van-field__control>div {
  width: 100%;
}
</style>
