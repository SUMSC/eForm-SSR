<script>
import QuestionHeader from '@/components/question-header'
export default {
  name: 'QuestionMixin',
  components: {
    'question-header': QuestionHeader
  },
  filters: {
    questionLabel (i) {
      return String.fromCharCode(65 + i) + '.'
    }
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    form () {
      return this.$store.state.qnaire.form[this.id]
    },
    data: {
      get () {
        return this.$store.state.answer[this.id]
      },
      set (value) {
        this.$emit('clear', 'answer.' + this.id)
        this.$store.commit('updateAnswer', { id: this.id, value })
      }
    }
  }
}
</script>
