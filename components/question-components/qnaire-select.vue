<template>
  <div>
    <question-header :id="id" :name="form.name" :required="form.required" :description="form.description" />
    <div v-if="!mobile" class="q-container">
      <div class="q-form-container">
        <el-radio-group v-model="data">
          <el-radio
            v-for="(radio, i) in selection"
            :key="radio.label"
            v-model="data"
            :label="radio.label"
            :class="{ 'q-radio' : radio.value.length >= 8 }"
          >
            <span class="q-radio-label">
              {{ i | questionLabel }}
            </span>
            {{ radio.value }}
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <van-radio-group v-else v-model="data">
      <van-cell
        v-for="(radio, i) in selection"
        :key="radio.label"
      >
        <template #title>
          <van-radio :name="radio.label" class="m-q-radio">
            <span class="m-q-radio-label">{{ i | questionLabel }}</span>
            <span>{{ radio.value }}</span>
          </van-radio>
        </template>
      </van-cell>
    </van-radio-group>
  </div>
</template>

<script>
import QuestionMixin from '@/mixins/QuestionMixin'

export default {
  name: 'QnaireSelect',
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
  }
  .m-q-radio-label {
    font-weight: bold;
    margin-right: .3rem;
  }
  .m-q-radio {
    font-size: 1rem;
    padding: .3rem 0;
  }
</style>
