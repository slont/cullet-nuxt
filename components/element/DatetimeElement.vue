<template>
  <cl-element class="datetime-element" :params="params" placeholder="ラベル（オプション）"
              @remove="$emit('remove')" :editable="editable"
              @focus="$emit('focus')" @blur="$emit('blur')">
    <span class="element-type-icon icon is-left" v-if="editable">
      <i class="material-icons">schedule</i>
    </span>
    <div class="control flexbox">
      <el-time-select v-model="params.valueStr" :readonly="!editable" v-if="'time' === params.type"
                      placeholder="Select time" :class="{ 'is-size-5': !editable }"
                      @focus="$emit('focus')" @blur="$emit('blur')"/>
      <el-date-picker v-model="params.valueStr" :type="params.type" :readonly="!editable" v-else
                      :placeholder="`Select ${params.type}`" :class="{ 'is-size-5': !editable }"
                      @focus="$emit('focus')" @blur="$emit('blur')"/>

      <button class="toggle-button button is-outlined is-justify-end" v-if="editable" @click="toggle">
        <span v-if="'date' === params.type">日</span>
        <span v-if="'time' === params.type">時</span>
        <span v-if="'datetime' === params.type">日時</span>
      </button>
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
          type: 'datetime',
          label: '',
          valueStr: '',
          valueNum: 0,
          valueDbl: 0.0
        })
      },
      editable: Boolean
    },
    methods: {
      toggle() {
        switch (this.params.type) {
          case 'date':
            this.params.type = 'time'
            this.params.valueStr = ''
            break
          case 'time': this.params.type = 'datetime'; break
          default: this.params.type = 'date'
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .datetime-element {
    .toggle-button {
      height: 36px;
    }
    &:not(.is-editable) {
      .label:not(:last-child) {
        margin-bottom: 0;
      }
      .el-input {
        width: auto;
        margin-left: -.5em;

        input {
          border: none;
        }
      }
    }
  }
</style>
