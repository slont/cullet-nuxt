<template>
  <modal id="item-delete-modal" class="modal" ref="itemDeleteModal" @close="reset">
    <div class="modal-card-body">
      <div class="column">
        <div class="field">
          <label class="label">カレット名</label>
          <div class="control">
            {{ item.name }}
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
  import ItemModel from '@/models/Item'
  import Modal from '@/components/Modal'

  export default {
    components: { Modal },
    data() {
      return {
        theme: {
          id: ''
        },
        item: {
          id: '',
          name: ''
        },
        errorMessage: ''
      }
    },
    methods: {
      open(theme, item) {
        this.theme = theme
        this.item = item
        this.$refs.itemDeleteModal.open()
      },
      close() {
        this.reset()
        this.$refs.itemDeleteModal.close()
      },
      async ok() {
        await new ItemModel(this.theme.id).delete(this.item.id).catch(err => {
          this.errorMessage = err
          throw new Error(err)
        })

        this.$message({
          showClose: true,
          message: '削除されました',
          type: 'success'
        })
        this.close()
        this.$emit('refresh')
      },
      reset() {
        Object.assign(this.$data, this.$options.data.call(this))
        this.$nextTick(() => this.errors.clear())
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #item-delete-modal {
    .modal-card {
      top: 33%;
      left: 0;
      position: fixed;

      .modal-card-body {
        max-height: 140px;

        .is-danger {
          color: $danger;
        }
      }
    }
  }
</style>
