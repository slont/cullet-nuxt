<template>
  <element-button class="datetime-button" icon="schedule" label="DateTime"
                  @click.native="addElement('datetime')"></element-button>
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
      addElement(type) {
        const element = Object.assign({}, ELEMENT, { type: type })
        this.$emit('add', element)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .datetime-button {
  }
</style>
