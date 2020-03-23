<template>
  <div class="q-container">
    <question-header :id="id" :name="form.name" :required="form.required" :description="form.description" />
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
</template>

<script>
import QuestionMixin from '@/mixins/QuestionMixin'

export default {
  name: 'AreaPicker',
  mixins: [QuestionMixin],
  computed: {
    chinaArea () {
      return this.$store.state.chinaArea
    }
  },
  created () {
    this.$store.dispatch('getChinaArea')
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
