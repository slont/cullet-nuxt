<template>
  <element-button class="text-button" icon="text_fields" label="Text"
                  @click.native="addElement">
  </element-button>
</template>

<script>
  import ElementButton from './ElementButton'
  import { ELEMENT } from '@/constant'

  export default {
    components: { ElementButton },
    data() {
      return {}
    },
    methods: {
      addElement() {
        const element = Object.assign({}, ELEMENT, { type: 'text' })
        this.$emit('add', element)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .text-button {
    $amount: 2;

    .sub-content {
      height: $element-button-size * $amount;
    }
  }
</style>
