<template>
  <div>
    <question-header :id="id" :name="form.name" :required="form.required" :description="form.description" />
    <div v-if="!mobile" class="q-container">
      <div class="q-form-container">
        <el-date-picker
          v-model="data"
          :type="form.meta.type ? form.meta.type: 'date'"
          placeholder="选择日期"
        />
      </div>
    </div>
    <div v-else>
      <van-cell is-link @click="showPopup">
        {{ data ? strptime : '选择日期' }}
      </van-cell>
      <van-popup v-model="show" position="bottom">
        <van-datetime-picker
          v-model="data"
          :type="form.meta.type ? form.meta.type: 'date'"
          @confirm="show = false"
          @cancel="show = false"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import QuestionMixin from '@/mixins/QuestionMixin'

export default {
  name: 'DatePicker',
  mixins: [QuestionMixin],
  data () {
    return {
      show: false
    }
  },
  computed: {
    strptime () {
      if (this.form.meta.type && this.form.meta.type === 'datetime') {
        return moment(this.data).format('YYYY-MM-DD HH:mm:SS')
      } else {
        return moment(this.data).format('YYYY-MM-DD')
      }
    }
  },
  methods: {
    showPopup () {
      this.show = true
    }
  }
}
</script>

<style scoped>
  .q-container {
    margin-top: 20px;
  }
  .q-form-container {
    width: 100%;
    margin-top: 5px;
    padding: 5px 0 10px 20px;
  }
  .q-input {
    width: 40em;
    padding: 3px
  }
</style>
