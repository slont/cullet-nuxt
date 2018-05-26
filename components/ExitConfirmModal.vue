<template>
  <modal id="exit-confirm-modal" class="modal" ref="exitConfirmModal">
    <div class="modal-card-body">
      <div class="column">
        <div class="field">
          <div class="control">
            変更は破棄されますがよろしいですか？
          </div>
        </div>
      </div>
    </div>

    <footer class="modal-card-foot has-right">
      <a @click="close" class="button">キャンセル</a>
      <a @click="ok" class="button is-primary">OK</a>
    </footer>
  </modal>
</template>

<script>
  import Modal from '@/components/Modal'

  export default {
    components: { Modal },
    data() {
      return {
        next: () => {}
      }
    },
    methods: {
      open(next) {
        this.next = next
        this.$refs.exitConfirmModal.open()
      },
      close() {
        this.next(false)
        this.$refs.exitConfirmModal.close()
      },
      async ok() {
        this.next()
        this.$refs.exitConfirmModal.close()
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #exit-confirm-modal {
    .modal-card {
      top: 33%;
      left: 0;
      position: fixed;

      .modal-card-body {
        max-height: 86px;
      }
    }
  }
</style>
