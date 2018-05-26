<template>
  <element-button class="email-button" icon="email" label="Email"
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
        const element = Object.assign({}, ELEMENT, { type: 'email' })
        this.$emit('add', element)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .email-button {
  }
</style>
