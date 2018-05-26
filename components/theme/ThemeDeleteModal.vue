<template>
  <modal id="theme-delete-modal" class="modal" ref="themeDeleteModal" @close="reset">
    <div class="modal-card-body">
      <div class="column">
        <div class="field">
          <label class="label">テーマタイトル</label>
          <div class="control">
            {{ theme.name }}
          </div>
        </div>

        <div class="field">
          <div class="control is-danger">
            本当に削除しますか？
          </div>
        </div>
      </div>
    </div>

    <span class="has-text-danger" v-if="errorMessage">{{ errorMessage }}</span>
    <footer class="modal-card-foot has-right">
      <guard-button :click="ok" class="is-danger">削除</guard-button>
      <a @click="close" class="button">キャンセル</a>
    </footer>
  </modal>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import Modal from '@/components/Modal'

  export default {
    components: { Modal },
    data() {
      return {
        theme: {
          id: '',
          title: ''
        },
        errorMessage: ''
      }
    },
    methods: {
      open(theme) {
        this.theme = theme
        this.$refs.themeDeleteModal.open()
      },
      close() {
        this.reset()
        this.$refs.themeDeleteModal.close()
      },
      async ok() {
        await new ThemeModel().delete(this.theme.id).catch(err => {
          this.errorMessage = err
          throw new Error(err)
        })

        this.$emit('refresh')
        this.$message({
          showClose: true,
          message: '削除されました',
          type: 'success'
        })
        this.close()
      },
      reset() {
        Object.assign(this.$data, this.$options.data.call(this))
        this.$nextTick(() => this.errors.clear())
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #theme-delete-modal {
    .modal-card-body {
      .is-danger {
        color: $danger;
      }
    }
  }
</style>
