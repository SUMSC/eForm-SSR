<template>
  <div>
    <question-header :id="id" :name="form.name" :required="form.required" :description="form.description" />
    <div v-if="!mobile" class="q-container">
      <div class="q-form-container">
        <el-cascader
          v-model="data"
          placeholder="选择地区，可以搜索"
          :options="chinaArea"
          filterable
          class="q-picker"
        />
      </div>
    </div>
    <div v-else>
      <van-cell is-link @click="showPopup">
        {{ data.length ? vantAnswer.join(' / ') : '选择地区' }}
      </van-cell>
      <van-popup v-model="show" position="bottom">
        <van-picker show-toolbar :title="form.name" :columns="mobileChinaArea" @confirm="handleConfirm" @cancel="show = false" />
      </van-popup>
    </div>
  </div>
</template>

<script>
import find from 'lodash/find'
import QuestionMixin from '@/mixins/QuestionMixin'
import { fixVantData } from '@/utils'

export default {
  name: 'AreaPicker',
  mixins: [QuestionMixin],
  data () {
    return {
      show: false,
      vantAnswer: []
    }
  },
  computed: {
    chinaArea () {
      return this.$store.state.chinaArea
    },
    mobileChinaArea () {
      return this.chinaArea.map(fixVantData)
    }
  },
  created () {
    this.$store.dispatch('getChinaArea')
  },
  methods: {
    showPopup () {
      this.show = true
    },
    handleConfirm (e) {
      this.vantAnswer = e
      const province = find(this.chinaArea, { label: e[0] })
      const city = find(province.children, { label: e[1] })
      const county = find(city.children, { label: e[2] })
      this.data = [province.value, city.value, county.value]
      this.show = false
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
  .q-picker {
    width: 30em;
    padding: 3px
  }
</style>
