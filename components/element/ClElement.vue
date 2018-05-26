<template>
  <div class="cl-element" :class="{ 'is-editable': editable }">
    <label class="view-label label control" v-if="params.label && !editable">
      {{ params.label }}
    </label>
    <div class="control label-control flexbox has-align-centered has-icons-left" v-else-if="editable">
      <input v-model.trim="params.label" class="input label" type="text" :placeholder="placeholder"
             @focus="$emit('focus')" @blur="$emit('blur')">
    </div>
    <slot/>
  </div>
</template>

<script>
  import RatingIcon from '@/components/RatingIcon'

  export default {
    components: { RatingIcon },
    props: {
      params: {
        type: Object,
        default: () => ({
          label: ''
        })
      },
      icon: String,
      editable: Boolean,
      placeholder: {
        type: String,
        default: 'Label'
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .cl-element {
    position: relative;
    line-height: 1.25rem;

    .control {
      width: 100%;
    }
    .label {
      &:not(:last-child) {
        margin-bottom: 1em;
      }
      &:focus, &:active {
        border-color: $primary;
      }
    }
    .view-label {
      border-bottom: $border-style;
    }
    .label-control {
      position: relative;

      .label {
        margin-bottom: -3px;
        padding-bottom: 0;
        box-shadow: none;
        border-top: none;
        border-right: none;
        border-left: none;
        border-radius: 0;
        z-index: 1;
        background-color: transparent;
      }
      + .element-type-icon {
        font-size: 1.5em;
        position: absolute;
        top: .5em;
        left: .5em;
        color: gainsboro;

        &.fa-icon {
          top: 1em;
          left: 1em;
        }
      }
      .material-icons:not(:last-child) {
        font-size: 1.25rem;
        margin-bottom: 0;
      }
      .rating-icon {
        width: 1.315rem;

        .material-icons {
          font-size: .4rem !important;
        }
      }
    }
    .input,
    .textarea {
      &:focus {
        z-index: 2;
      }
    }
  }
</style>
