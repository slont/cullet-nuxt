<template>
  <cl-element class="tag-element" :params="params" placeholder="ラベル（オプション）"
              @remove="$emit('remove')" :editable="editable"
              @focus="$emit('focus')" @blur="$emit('blur')">
    <span class="element-type-icon icon is-left" v-if="editable">
      <i class="material-icons">label_outline</i>
    </span>
    <div class="tags-control control flexbox">
      <el-tag v-for="(tag, i) in tags" :key="tag" type="warning" :closable="editable"
              :disable-transitions="true" @close="remove(i)">{{tag}}</el-tag>
      <input v-model="inputVal" class="input-new-tag input" v-if="editable"
             @keyup.enter="confirmInput" @focus="$emit('focus')" @blur="onBlur"/>
    </div>
  </cl-element>
</template>

<script>
  import ClElement from './ClElement'
  const DELIMITER = '- '

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
    },
    data() {
      return {
        tags: this.params.valueStr ? this.params.valueStr.split(DELIMITER) : [],
        inputVal: ''
      }
    },
    methods: {
      remove(i) {
        this.$delete(this.tags, i)
        this.params.valueStr = this.tags.join(DELIMITER)
      },
      confirmInput() {
        const inputVal = this.inputVal
        if (inputVal) {
          this.tags.push(inputVal)
        }
        this.inputVal = ''
        this.params.valueStr = this.tags.join(DELIMITER)
      },
      onBlur() {
        this.confirmInput()
        this.$emit('blur')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .tag-element {
    .view-label.label {
      margin-bottom: .5em;
    }
    .tags-control {
      flex-wrap: wrap;
      margin-left: -.5rem;

      .el-tag {
        font-size: $size-6;
        margin-left: .5rem;
      }
      .input-new-tag {
        margin-left: .5rem;
        width: auto;
      }
    }
  }
</style>
