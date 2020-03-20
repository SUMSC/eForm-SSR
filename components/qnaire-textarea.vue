<template>
  <div class="q-container">
    <question-header :id="id" :name="form.name" :required="form.required" :description="form.description" />
    <div class="q-form-container">
      <el-input
        v-model="data"
        class="q-input"
        size="medium"
        type="textarea"
      />
    </div>
  </div>
</template>

<script>
import QuestionMixin from '@/mixins/QuestionMixin'

export default {
  name: 'QnaireTextarea',
  mixins: [QuestionMixin]
}
</script>

<style scoped>
  .q-container {
    margin-top: 20px;
  }
  .q-form-container {
    width: 100%;
    padding: 5px 0 10px 20px;
  }
  .q-input {
    width: 40em;
    margin-top: 10px;
  }
</style>
