<template>
  <div class="dropdown" :class="{ 'is-active': active }">
    <div class="dropdown-trigger" @click="toggle">
      <slot name="trigger"/>
    </div>
    <div class="dropdown-menu" role="menu">
      <div class="dropdown-content" @click="close">
        <slot/>
      </div>
    </div>
    <div class="dropdown-backdrop" @click="close"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        active: false
      }
    },
    methods: {
      toggle() {
        this.active = !this.active
      },
      close() {
        this.active = false
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .dropdown {
    .dropdown-menu {
      z-index: 100;
    }
    .dropdown-backdrop {
      display: none;
    }
    &.is-active {
      .dropdown-backdrop {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        z-index: 99;
      }
    }
  }
</style>
