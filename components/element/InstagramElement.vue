<template>
  <cl-element class="instagram-element" :params="params" placeholder="ラベル（オプション）"
              @remove="$emit('remove')" :editable="editable"
              @focus="$emit('focus')" @blur="$emit('blur')">
    <span class="element-type-icon fa-icon icon is-left is-size-6" v-if="editable">
      <i class="fab fa-instagram"></i>
    </span>
    <div class="control">
      <input v-model.trim="params.valueStr" class="input" type="text" v-if="editable"
             @focus="$emit('focus')" @blur="$emit('blur')" placeholder="IDまたはリンクURL">

      <blockquote class="instagram-media" v-if="url"
                  :data-instgrm-permalink="url" data-instgrm-version="8"></blockquote>
    </div>
  </cl-element>
</template>

<script>
  import ClElement from './ClElement'

  const REGEX = /.*(https?:\/\/www\.instagram\.com\/p\/\w+\/?).*/

  export default {
    components: {ClElement},
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
    },
    computed: {
      url() {
        if (REGEX.test(this.params.valueStr)) {
          return this.params.valueStr.replace(REGEX, '$1')
        } else {
          return this.params.valueStr
        }
      }
    },
    watch: {
      'params.valueStr'(e) {
        if (REGEX.test(e)) {
          this.params.valueStr = this.params.valueStr.replace(REGEX, '$1')
          this.reloadInstgrm()
        }
      }
    },
    mounted() {
      this.reloadInstgrm()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .instagram-element {
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
    .instagram-media.instagram-media-rendered {
      width: 100%;
      max-width: 480px;
      margin: auto !important;
    }
    .HoverCardCTA {
      display: none !important;
    }
  }
</style>
