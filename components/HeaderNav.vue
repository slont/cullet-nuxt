<template>
  <nav id="header-nav" class="navbar is-fixed-top" :class="{ 'is-active': activeHeader }">
    <div class="container">
      <div class="navbar-brand">
        <div class="navbar-item logo" @click="$router.push(`/`)">
          <img class="cullet-logo" src="/img/cullet-logo_orange.png" alt="Colette">
        </div>

        <div class="navbar-item field search-field is-hidden-tablet" v-if="!loggedIn">
          <div class="control has-icons-right">
            <input v-model="query" class="input is-rounded"
                 placeholder="キーワード検索"/>
            <span class="icon is-small is-right"><i class="fas fa-search"></i></span>
          </div>
        </div>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start">
          <nuxt-link to="/" class="navbar-item" exact>
            <span class="icon"><i class="fas fa-home fa-pull-left"></i></span>
            <span>ホーム</span>
          </nuxt-link>
          <nuxt-link :to="`/u/${user.id}`" class="navbar-item" v-if="loggedIn">
            <span class="icon"><i class="far fa-user-circle fa-pull-left"></i></span>
            <span>マイページ</span>
          </nuxt-link>
        </div>

        <div class="navbar-end">
          <div class="account-item navbar-item" v-if="loggedIn">
            <dropdown ref="accountDropdown">
              <template slot="trigger">
                <span class="user-name is-size-7">{{ user.name }}</span>
                <user-image :src="user.image" class="circle" v-if="user.image"/>
                <span class="icon" v-else><i class="material-icons">arrow_drop_down</i></span>
              </template>

              <nuxt-link to="/settings/profile" class="dropdown-item">
                設定
              </nuxt-link>
              <hr class="dropdown-divider">
              <a @click="signout" class="dropdown-item">
                <span class="icon"><i class="material-icons">exit_to_app</i></span>
                サインアウト
              </a>
            </dropdown>
          </div>
          <div class="navbar-item" v-else>
            <div class="field is-grouped">
              <div class="control">
                <nav class="breadcrumb">
                  <ul>
                    <li><nuxt-link :to="`/signin?redirect=${encodeURIComponent($route.path)}`">ログイン</nuxt-link></li>
                    <li><nuxt-link to="/signup">新規登録</nuxt-link></li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  import Dropdown from '@/components/Dropdown'
  // const HEADER_HEIGHT = 46

  export default {
    components: { Dropdown },
    data() {
      return {
        // scrolledVal: 0,
        // headerPos: 0,
        query: ''
      }
    },
    computed: {
      activeHeader() {
        return this.$store.state.activeHeader
      }
    },
    // created() {
    //   window.addEventListener('scroll', this.handleScroll)
    // },
    // destroyed() {
    //   window.removeEventListener('scroll', this.handleScroll)
    // },
    methods: {
      // handleScroll(e) {
      //   const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      //   let diff = this.scrolledVal - scrollTop
      //   if (this.scrolledVal < scrollTop) {
      //     this.headerPos = Math.max(-HEADER_HEIGHT, this.headerPos + diff)
      //   } else {
      //     diff = Math.sign(diff) * Math.min(10, Math.abs(diff))
      //     this.headerPos = Math.min(0, this.headerPos + diff)
      //   }
      //   this.scrolledVal = scrollTop
      // },
      signout() {
        this.$store.dispatch('signout').then(() => {
          this.$router.push('/')
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #header-nav {
    /*@import '@/assets/styles/constant.scss';*/

    height: $header-nav-height;
    box-shadow: $box-shadow;
    z-index: 20;

    .container {
      max-width: $width;

      .navbar-brand {
        .logo {
          padding-left: .5em;
          padding-right: 0;
          cursor: pointer;

          img {
            max-height: 2.25rem;
          }
        }
        .search-field {
          margin-left: auto;
          padding-right: .5em;

          .input {
            background: transparent;
            color: white;
            border: 1px solid #e07b00;
          }
        }
      }
      .navbar-menu {
        .navbar-start {
          .icon {
            font-size: $size-4;
          }
        }
        .navbar-end {
          .account-item {
            .dropdown-trigger {
              display: flex;
              align-items: center;
              cursor: pointer;

              .user-name {
                margin-right: .25rem;
              }
              img {
                height: 2.25rem;
                max-height: 2.25rem;
                width: 2.25rem;
              }
            }
          }
        }
        /* SP用 */
        &.is-hidden-tablet.is-active {
          .navbar-item {
            display: flex;
            align-items: center;

            .icon {
              margin-right: .5em;
            }
          }
        }
      }
    }
  }
</style>
