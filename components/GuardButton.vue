<template>
  <button class="button" @click="onClick"
          :class="{ 'is-loading': processing }" :disabled="disabled || processing">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'guard-button',
    props: {
      // Promise.resolveを返すfunction
      click: Function,
      callback: {
        type: Function,
        default: () => ({})
      },
      disabled: Boolean
    },
    data() {
      return {
        processing: false
      }
    },
    computed: {
      inValid() {
        return this.disabled | this.processing
      }
    },
    methods: {
      async onClick(e) {
        if (this.inValid) return

        this.processing = true
        e.preventDefault()
        e.stopPropagation()

        const res = await this.click()
        this.processing = false
        if (this.callback) {
          this.callback(res)
        }
      }
    }
  }
</script>
