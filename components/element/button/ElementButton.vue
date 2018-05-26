<template>
  <a class="element-button button is-info is-outlined has-align-centered">
    <span class="fa-icon icon" v-if="icon && /^fa.+/.test(icon)">
      <i class="fa-2x" :class="icon"></i>
    </span>
    <span class="icon" v-else-if="icon">
      <i class="material-icons is-size-2">{{ icon }}</i>
    </span>
    <span class="element-label" v-if="label">{{ label }}</span>

    <slot/>
  </a>
</template>

<script>
  export default {
    props: {
      icon: '',
      label: ''
    },
    data() {
      return {}
    },
    methods: {
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .element-button {
    &.button {
      height: $element-button-size;
      width: $element-button-size;
      border-radius: 0;
    }
    position: relative;
    flex-direction: column;
    justify-content: center;

    .icon:first-child:not(:last-child) {
      margin: .5em 0;
    }
    .material-icons {
      height: 2.4rem;
      line-height: 2.4rem;
    }
    .label {
      font-size: $size-8;
    }
    .element-label {
      font-size: $size-8;
    }
    .sub-content {
      position: absolute;
      top: -1px;
      right: -$element-button-size;
      width: $element-button-size;
      display: none;

      &.has-addons .button {
        :not(:last-child) {
          margin-right: 0;
        }
      }
    }
    &:last-child {
      .sub-content {
        top: initial;
        bottom: -2px;
      }
    }
    &:hover {
      z-index: 2;

      .sub-content {
        display: flex;
        flex-direction: column;
        background-color: white;
      }
    }
  }
</style>
