<template>
  <cl-element class="rating-element" :params="params" placeholder="ラベル（オプション）"
              @remove="$emit('remove')" :editable="editable"
              @focus="$emit('focus')" @blur="$emit('blur')">
    <span class="element-type-icon icon is-left" v-if="editable"><rating-icon/></span>
    <div class="control flexbox">
      <el-rate v-model="params.valueDbl" :max="Number(params.valueStr)" allow-half
               :disabled="!editable"/>

      <div class="buttons has-addons is-justify-end">
        <button class="toggle-button button is-outlined is-justify-end" @click="minus" v-if="editable">
          <span class="icon"><i class="material-icons">remove</i></span>
        </button>
        <button class="toggle-button button is-outlined is-justify-end" @click="plus" v-if="editable">
          <span class="icon"><i class="material-icons">add</i></span>
        </button>
      </div>
    </div>
  </cl-element>
</template>

<script>
  import ClElement from './ClElement'
  import RatingIcon from '@/components/RatingIcon'

  export default {
    components: { ClElement, RatingIcon },
    props: {
      params: {
        type: Object,
        default: () => ({
          label: '',
          valueStr: '5',
          valueNum: 0,
          valueDbl: 0.0
        })
      },
      editable: Boolean
    },
    methods: {
      plus() {
        this.params.valueStr = String(Math.min(10, Number(this.params.valueStr) + 1))
      },
      minus() {
        this.params.valueStr = String(Math.max(1, Number(this.params.valueStr) - 1))
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .rating-element {
    &:not(.is-editable) .label:not(:last-child) {
      margin-bottom: .5em;
    }
    .el-rate__icon {
      font-size: 24px;
    }
    .element-type-icon .rating-icon {
      display: flex;

      > .material-icons {
        font-size: .35em !important;
        color: gainsboro;
      }
    }
  }
</style>
