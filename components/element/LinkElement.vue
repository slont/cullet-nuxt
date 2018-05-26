<template>
  <cl-element class="link-element" :params="params" placeholder="ラベル（オプション）"
              @remove="$emit('remove')" :editable="editable"
              @focus="$emit('focus')" @blur="$emit('blur')">
    <span class="element-type-icon icon is-left" v-if="editable">
      <i class="material-icons">link</i>
    </span>
    <div class="control">
      <input v-model.trim="params.valueStr" class="input value" type="text" placeholder="Link"
             @focus="$emit('focus')" @blur="$emit('blur')" v-if="editable">

      <a :href="params.valueStr" class="value" target="_blank" v-else>{{ params.valueStr }}</a>
    </div>
  </cl-element>
</template>

<script>
  import ClElement from './ClElement'

  export default {
    components: { ClElement },
    props: {
      params: {
        type: Object,
        default: () => ({
          label: '',
          valueStr: '',
          valueNum: 0,
          valueDbl: 0.0
        })
      },
      editable: Boolean
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .link-element {
    .input {
      padding-top: .25em;
      padding-left: .25em;
      border-left: none;
      border-top: none;
      border-right: none;
      border-radius: 0;
      box-shadow: none;

      &:focus, &:active {
        border-color: $primary;
      }
    }
    .value {
      color: $link;
      text-decoration: underline;
      word-wrap: break-word;
    }
  }
</style>
