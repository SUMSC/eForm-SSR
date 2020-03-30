<template>
  <div v-if="!$store.state.mobile" class="q-header">
    <p class="q-title">
      <span class="q-topic">{{ id | idNormalize }}</span>
      <span class="q-name">{{ name }}</span>
      <span v-if="required" class="required">*</span>
    </p>
    <p v-if="description.length" class="q-description">
      {{ description }}
    </p>
  </div>
  <van-cell v-else class="m-q-header">
    <template #title>
      <span class="q-topic">{{ id | idNormalize }}</span>
      <span class="q-name">{{ name }}</span>
      <span v-if="required" class="required">*</span>
    </template>
  </van-cell>
</template>

<script>
export default {
  name: 'QuestionHeader',
  filters: {
    idNormalize (id) {
      id = id + 1
      if (id < 9) {
        return '0' + id
      } else {
        return '' + id
      }
    }
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
  .q-title {
    font-size: 21px;
    line-height: 32px;
    color: #444444;
    padding-top: 2px;
    text-align: left;
    position: relative;
  }
  .q-title .q-topic{
    font-weight: bold;
    float: left;
    width: 32px;
  }
  .q-title .required {
    color: red;
    position: absolute;
    top: 3px;
    left: -15px;
    font-weight: bold;
  }
  .q-title .q-name {
    overflow: hidden;
    zoom: 1;
  }
  .q-description {
    color: #909399;
    font-size: 14px;
    margin: 10px 0 5px 20px;
  }
  .m-q-header {
    padding: 1.2rem;
  }
  .m-q-header .required {
    color: red;
  }
  .m-q-header .q-topic {
    font-weight: bold;
    font-size: 1.1rem;
  }
  .m-q-header .q-name {
    font-size: 1.1rem;
  }
</style>
