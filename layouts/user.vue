<template>
  <div id="app">
    <header-nav/>
    <div id="userpage-index" class="container" @scroll="infiniteScroll">
      <header class="userpage-header header-shadow">
        <article class="user-profile media has-align-centered">
          <figure class="media-left" v-if="target.image">
            <div class="image circle flexbox is-64x64">
              <user-image :src="target.image"/>
            </div>
          </figure>
          <div class="media-content">
            <div class="content">
              <div class="user-name">
                <span class="title is-4">{{ target.name }}</span><span class="subtitle is-6">@{{ urlUserId }}</span>
              </div>
              <nuxt-link to="/settings/profile" v-if="loggedIn && isSelf"
                         class="profile-edit-button button is-info is-outlined is-small">
                プロフィール編集
              </nuxt-link>
              <nuxt-link to="/settings" v-if="loggedIn && isSelf"
                         class="settings-button button is-info is-outlined is-small">
                <span class="icon is-small"><i class="material-icons">settings</i></span>
              </nuxt-link>
              <div class="user-bio">{{ target.biography }}</div>
            </div>
          </div>
        </article>
        <div class="tabs">
          <ul>
            <nuxt-link :to="`/u/${urlUserId}`" class="cullet-tab" tag="li" exact>
              <a class="has-text-centered">
                <span class="label-name">カレット</span><br/>
                <span class="label-count">{{ target.itemCount }}</span>
              </a>
            </nuxt-link>
            <nuxt-link :to="`/u/${urlUserId}/themes`" class="theme-tab" tag="li" exact>
              <a class="has-text-centered">
                <span class="label-name">テーマ</span><br/>
                <span class="label-count">{{ target.themeCount }}</span>
              </a>
            </nuxt-link>
            <nuxt-link :to="`/u/${urlUserId}/favorites`" class="favorite-tab" tag="li">
              <a class="has-text-centered">
                <span class="label-name">お気に入り</span><br/>
                <span class="label-count">{{ target.favoriteCount }}</span>
              </a>
            </nuxt-link>
          </ul>
        </div>
      </header>

      <transition name="slide-fade" mode="out-in">
        <nuxt/>
      </transition>

      <a @click="$refs.themeCreateModal.open()" v-if="loggedIn"
         class="button button-create is-float is-primary circle is-hidden-mobile">
        <i class="material-icons">add</i>
      </a>

      <theme-create-modal ref="themeCreateModal" @refresh="refreshThemes"/>
      <theme-edit-modal ref="themeEditModal" @refresh="refreshThemes"/>
    </div>
    <footer-nav class="is-hidden-desktop"/>
  </div>
</template>

<script>
  import HeaderNav from '@/components/HeaderNav'
  import FooterNav from '@/components/FooterNav'
  import ThemeCard from '@/components/theme/ThemeCard'
  import ThemeCreateModal from '@/components/theme/ThemeCreateModal'
  import ThemeEditModal from '@/components/theme/ThemeEditModal'
  import Items from '@/components/views/u/Items'
  import Themes from '@/components/views/u/Themes'
  import Favorites from '@/components/views/u/Favorites'

  export default {
    components: {HeaderNav, FooterNav, ThemeCard, ThemeCreateModal, ThemeEditModal, Items, Themes, Favorites},
    data() {
      return {
        target: {
          id: '',
          name: '',
          biography: '',
          image: ''
        }
      }
    },
    fetch({ store, params }) {
      if (store.state.user.id && !store.state.theme.id) {
        return this.$store.dispatch('modules/user/findThemes', {
          id: this.user.id,
          query: {p: 1, s: 1}
        }).then(res => {
          if (res.data.length) {
            store.commit('SET_THEME', res.data[0])
          }
        })
      }
    },
    computed: {
      urlUserId() {
        return this.$route.params.userId
      },
      isSelf() {
        return this.user.id === this.urlUserId
      }
    },
    watch: {
      '$route.params.userId': 'refresh'
    },
    created() {
      if (this.isSelf) {
        Object.assign(this.target, this.user)
      }
      this.refresh()
    },
    methods: {
      refresh() {
        return this.$store.dispatch('modules/user/findOneWithReport', {id: this.urlUserId}).then(res => {
          this.target = res.data
          if (this.isSelf) {
            this.$store.commit('SET_USER', res.data)
          }
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: 'データ取得に失敗しました',
            type: 'error'
          })
        })
      },
      refreshThemes() {
        this.$refs.child.refresh()
      },
      openEditModal(theme) {
        this.$refs.themeEditModal.open(theme)
      },
      infiniteScroll(event) {
        if (event.target.scrollHeight <= event.target.scrollTop + event.target.offsetHeight) {
          this.$refs.child.fetch()
        }
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
