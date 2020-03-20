<template>
  <div class="q-container">
    <question-header :id="id" :name="form.name" :required="form.required" :description="form.description" />
    <div class="q-form-container">
      <el-date-picker
        v-model="data"
        :type="form.meta.type ? form.meta.type: 'date'"
        placeholder="选择日期"
      />
    </div>
  </div>
</template>

<script>
import QuestionMixin from '@/mixins/QuestionMixin'

export default {
  name: 'QnaireInput',
  mixins: [QuestionMixin]
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
