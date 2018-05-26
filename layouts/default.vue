<template>
  <div id="app">
    <header-nav/>
    <transition name="slide-fade" mode="out-in">
      <nuxt class="container"/>
    </transition>
    <footer-nav class="is-hidden-desktop"/>
  </div>
</template>

<script>
  import HeaderNav from '@/components/HeaderNav'
  import FooterNav from '@/components/FooterNav'
  import UserModel from '@/models/User'

  export default {
    components: {HeaderNav, FooterNav},
    fetch({ store, params }) {
      if (store.state.user.id && !store.state.theme.id) {
        return new UserModel().findThemes(store.state.user.id, {p: 1, s: 1}).then(res => {
          if (res.data.length) {
            store.commit('SET_THEME', res.data[0])
          }
        })
      }
    },
    created() {
      if (this.user.id && !this.$store.state.theme.id) {
        return new UserModel().findThemes(this.user.id, {p: 1, s: 1}).then(res => {
          if (res.data.length) {
            this.$store.commit('SET_THEME', res.data[0])
          }
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #app {
    position: absolute;
    min-height: 100vh;
    width: 100%;
    top: 0;
    overflow-y: scroll;
    -webkit-overflow-scrolling : touch;
    /*background-color: #ffffff;*/

    > .container {
      height: 100%;
      padding-top: $header-nav-height;
    }

    @media screen and (max-width: 768px) {
      > .container {
        padding-bottom: $footer-nav-height;
      }
    }
  }
</style>
