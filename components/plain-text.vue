<template>
  <p>{{ form.name }}</p>
</template>
<script>
import QuestionMixin from '../mixins/QuestionMixin'

export default {
  name: 'PlainText',
  mixins: [QuestionMixin]
}
</script>

<style scoped>

</style>
