<template>
  <div class="q-container">
    <question-header :id="id" :name="form.name" :required="form.required" :description="form.description" />
    <div class="q-form-container">
      <el-checkbox-group v-model="data">
        <el-checkbox
          v-for="(radio, i) in selection"
          :key="radio.label"
          :label="radio.label"
          :class="{ 'q-radio' : radio.value.length >= 8 }"
        >
          <span class="q-radio-label">
            {{ i | questionLabel }}
          </span>
          {{ radio.value }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import QuestionMixin from '@/mixins/QuestionMixin'

export default {
  name: 'QnaireCheckbox',
  mixins: [QuestionMixin],
  computed: {
    selection () {
      return this.form.meta.selection.map((s, i) => ({
        ...s, label: i
      }))
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
  .q-radio {
    display: block;
    padding: 8px 0;
  }
  .q-radio-label {
    width: 28px;
    font-weight: bold;
    margin-left: 5px;
  }
</style>
