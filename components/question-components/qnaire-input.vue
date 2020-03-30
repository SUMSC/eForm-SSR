<template>
  <div>
    <question-header :id="id" :name="form.name" :required="form.required" :description="form.description" />
    <div v-if="!mobile" class="q-container">
      <div class="q-form-container">
        <el-input
          v-model="data"
          class="q-input"
          size="medium"
        />
      </div>
    </div>
    <van-field v-else v-model="data" placeholder="请输入" />
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
  padding: 5px 0 10px 20px;
}
.q-input {
  width: 40em;
  margin-top: 10px;
}
</style>
