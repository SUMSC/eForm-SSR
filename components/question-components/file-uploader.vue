<template>
  <div :class="{ 'q-container': !mobile }">
    <question-header
      :id="id"
      :name="form.name"
      :required="form.required"
      :description="form.description"
    />
    <div class="q-form-container">
      <el-upload
        :on-remove="handleRemove"
        :on-exceed="handleExceed"
        :on-success="handleSuccess"
        :limit="1"
        :before-remove="beforeRemove"
        :action="uploadURL"
        :headers="uploadHeader"
      >
        <el-button size="small" type="primary">
          点击上传
        </el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import { uploadURL, deleteFile } from '@/utils/requests'
import QuestionMixin from '@/mixins/QuestionMixin'

export default {
  name: 'QnaireInput',
  mixins: [QuestionMixin],
  data () {
    return {
      uploadURL
    }
  },
  computed: {
    uploadHeader () {
      return {
        X_CUSTOM_AUTH: this.$store.state.token
      }
    }
  },
  methods: {
    handleRemove () {
    },
    handleExceed () {
      this.$message.warning('无法上传更多文件了')
    },
    beforeRemove () {
      if (!this.mobile) {
        return this.$confirm('确定删除这个文件吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteFile(this.data)
          this.data = ''
        })
      } else {
        return Dialog.confirm({
          title: '提示',
          message: '确定删除这个文件吗？'
        }).then(() => {
          deleteFile(this.data)
          this.data = ''
        })
      }
    },
    handleSuccess (res) {
      this.data = res.message
      this.$store.commit('appendFile', res.message)
    }
  }
}
</script>

<style scoped>
  .q-container {
    margin-top: 20px;
  }
  .q-title {
    font-weight: bold;
    font-size: 15px;
    line-height: 20px;
    color: #444444;
    padding-top: 2px;
    text-align: left;
    position: relative;
  }
  .q-title .q-topic{
    float: left;
    width: 28px;
  }
  .q-title .required {
    color: red;
    position: absolute;
    top: 3px;
    left: -10px;
    font-weight: bold;
  }
  .q-title .q-name {
    overflow: hidden;
    zoom: 1;
  }
  .q-form-container {
    width: 100%;
    margin-top: 5px;
    padding: 5px 10px 10px 20px;
  }
  .q-input {
    width: 40em;
    padding: 3px
  }
</style>
