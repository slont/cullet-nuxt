<template>
  <element-button class="rating-button"
                  @click.native="addElement">
    <rating-icon/>
    <span class="element-label">Rating</span>
  </element-button>
</template>

<script>
  import ElementButton from './ElementButton'
  import RatingIcon from '@/components/RatingIcon'
  import { ELEMENT } from '@/constant'

  export default {
    components: { ElementButton, RatingIcon },
    data() {
      return {}
    },
    methods: {
      addElement() {
        const element = Object.assign({}, ELEMENT, { type: 'rating', valueStr: '5' })
        this.$emit('add', element)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .rating-button {
  }
</style>
