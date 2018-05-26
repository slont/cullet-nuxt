<template>
  <div class="modal" :class="{ 'is-active': active, 'has-backdrop': backdrop }">
    <div class="backdrop" @click="close"></div>
    <div @click="close" class="modal-background"></div>
    <div class="modal-card">
      <slot></slot>
    </div>
    <a @click="close" class="button modal-close is-large" aria-label="close" v-if="deletable"></a>
  </div>
</template>

<script>
  export default {
    props: {
      backdrop: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        active: false,
        deletable: false
      }
    },
    methods: {
      open() {
        this.active = true
      },
      close() {
        this.$emit('close')
        this.active = false
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .modal {
    .modal-card-head {
      background: white;
    }
    .modal-card-foot {
      background: white;
      height: 4rem;
    }
    .backdrop {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
    }
    .has-backdrop {
      .backdrop {
        display: block;
      }
    }

    @media screen and (max-width: 768px) {
      .modal-card {
        height: 100vh !important;
        width: 100vw !important;
        max-height: 100vh;
        margin: 0;
      }
      .modal-close:before,
      .modal-close:after{
        background-color: $label-color;
      }
    }
  }
</style>
