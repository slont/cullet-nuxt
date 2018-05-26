<template>
  <nav id="footer-nav" class="navbar is-fixed-bottom" :class="{ 'is-active': activeFooter }">
    <!-- ログイン済 -->
    <div class="navbar-brand logged-in" v-if="loggedIn">
      <nuxt-link to="/" class="navbar-item" exact>
        <span class="icon"><i class="fas fa-home"></i></span>
        <span class="subtitle is-7 has-text-weight-bold">Home</span>
      </nuxt-link>

      <a @click="onClickAdd" class="navbar-item button is-primary is-rounded">
        <span class="icon is-size-3"><i class="fas fa-pencil-alt"></i></span>
      </a>

      <nuxt-link :to="`/u/${user.id}`" class="navbar-item user-profile" exact>
        <figure class="image circle is-28x28 flexbox" v-if="user.image">
          <user-image :src="user.image"/>
        </figure>
        <span class="icon" v-else><i class="far fa-user-circle"></i></span>
        <span class="subtitle is-7 has-text-weight-bold">My Page</span>
      </nuxt-link>
    </div>
    <!-- 未ログイン -->
    <div class="navbar-brand logged-out has-text-centered" v-else>
      <nuxt-link :to="`/signin?redirect=${encodeURIComponent($route.path)}`"
                 class="navbar-item button is-primary is-outlined is-rounded">
        ログイン
      </nuxt-link>
      <nuxt-link to="/signup"
                 class="navbar-item button is-primary is-rounded">
        新規登録
      </nuxt-link>
    </div>

    <theme-create-modal ref="themeCreateModal"/>
  </nav>
</template>

<script>
  import ThemeCreateModal from '@/components/theme/ThemeCreateModal'

  export default {
    components: {ThemeCreateModal},
    computed: {
      activeFooter() {
        return this.$store.state.activeFooter
      }
    },
    methods: {
      async onClickAdd() {
        if (this.$store.state.theme.id) {
          this.$router.push(`/m/createItem/${this.$store.state.theme.id}`)
        } else {
          this.$refs.themeCreateModal.open()
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #footer-nav {
    box-shadow: $box-shadow;
    z-index: 20;

    .navbar-brand {
      max-height: 3.25rem;
      align-items: center;
      justify-content: space-evenly;

      .navbar-item {
        flex-direction: column;

        .icon {
          font-size: $size-3;
        }
        .image {
          img {
            max-height: initial;
          }
        }
      }
      &.logged-in {
        .navbar-item {
          justify-content: flex-end;
          height: 3.25rem;
          width: 20%;
          padding: 5px 0;

          &.user-profile {
            .image {
              min-height: 28px;
            }
          }
          &.nuxt-link-active,
          &.is-active,
          &:hover {
            border-bottom: 3px solid $primary;
            padding-bottom: 2px;
            background: transparent;

            span {
              color: $primary;
            }
          }
        }
        .button {
          justify-content: center;
          height: 58px;
          width: 58px;
          margin: -3px 6px 18px;
          border-top: 1px solid gainsboro;
          box-sizing: border-box;
          border-bottom: none;
          border-right: none;
          border-left: none;

          .icon {
            margin-left: -.35em;
          }
        }
      }
      &.logged-out {
        .button {
          padding: 1.125em 4em;
        }
      }
    }
  }
</style>
