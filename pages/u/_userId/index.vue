<template>
  <div id="user-index" ref="index" @scroll="infiniteScroll">
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
              <span class="icon is-small"><i class="fas fa-user-cog"></i></span>
            </nuxt-link>
            <p class="user-bio">{{ target.biography }}</p>
          </div>
        </div>
      </article>
      <div class="tabs">
        <ul>
          <li @click="activeTab = ''" class="cullet-tab"
              :class="{ 'is-active': '' === activeTab }">
            <a class="has-text-centered">
              <span class="label-name">カレット</span><br/>
              <span class="label-count">{{ target.itemCount }}</span>
            </a>
          </li>
          <li @click="activeTab = 'themes'" class="theme-tab"
              :class="{ 'is-active': 'themes' === activeTab }">
            <a class="has-text-centered">
              <span class="label-name">テーマ</span><br/>
              <span class="label-count">{{ target.themeCount }}</span>
            </a>
          </li>
          <li @click="activeTab = 'favorites'" class="favorite-tab"
              :class="{ 'is-active': 'favorites' === activeTab }">
            <a class="has-text-centered">
              <span class="label-name">お気に入り</span><br/>
              <span class="label-count">{{ target.favoriteCount }}</span>
            </a>
          </li>
        </ul>
      </div>
    </header>

    <transition name="slide-fade" mode="out-in">
      <favorites ref="child" @open-edit-modal="openEditModal" v-if="activeTab === 'favorites'"/>
      <themes ref="child" @open-edit-modal="openEditModal" v-else-if="activeTab === 'themes'"/>
      <items ref="child" @open-edit-modal="openEditModal" v-else/>
    </transition>

    <a @click="$refs.themeCreateModal.open()" v-if="loggedIn"
       class="button button-create is-float is-primary circle is-hidden-mobile">
      <i class="material-icons">add</i>
    </a>

    <theme-create-modal ref="themeCreateModal" @refresh="refreshThemes"/>
    <theme-edit-modal ref="themeEditModal" @refresh="refreshThemes"/>
  </div>
</template>

<script>
  import ThemeCard from '@/components/theme/ThemeCard'
  import ThemeCreateModal from '@/components/theme/ThemeCreateModal'
  import ThemeEditModal from '@/components/theme/ThemeEditModal'
  import Items from '@/components/views/u/Items'
  import Themes from '@/components/views/u/Themes'
  import Favorites from '@/components/views/u/Favorites'

  export default {
    components: {ThemeCard, ThemeCreateModal, ThemeEditModal, Items, Themes, Favorites},
    data() {
      return {
        activeTab: '',
        target: {
          id: '',
          name: '',
          biography: '',
          image: ''
        }
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
      if (process.browser) {
        window.addEventListener('scroll', this.infiniteScroll);
      }

      if (this.isSelf) {
        Object.assign(this.target, this.user)
      }
      this.refresh()
    },
    destroyed () {
      if (process.browser) {
        window.removeEventListener('scroll', this.infiniteScroll);
      }
    },
    methods: {
      refresh() {
        this.$store.dispatch('modules/user/findOneWithReport', {
          id: this.urlUserId,
          query: {p: 1, s: 10}
        }).then(res => {
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
        if (this.$refs.index.scrollHeight <= window.scrollY + window.innerHeight) {
          this.$refs.child.fetch()
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #user-index {
    background-color: $bg-color-main;

    .userpage-header {
      background-color: white;

      .user-profile {
        max-width: $width;
        margin-left: auto;
        margin-right: auto;
        padding: 1rem .5rem .5rem;
        border-bottom: $border-style;

        .content {
          margin-bottom: 0;

          .user-name {
            margin-bottom: .3rem;
          }
          .user-bio {
            margin-top: .3rem;
          }
          .icon.is-small i {
            font-size: $size-5;
          }
        }
      }
      .tabs {
        max-width: $width;
        margin-left: auto;
        margin-right: auto;

        > ul {
          border-bottom-color: transparent;

          li {
            a {
              flex-direction: column;
              line-height: .7;
              border-bottom-width: 0;

              .label-name {
                font-size: $size-7;
                font-weight: bold;
              }
              .label-count {
                font-size: $size-5;
                font-weight: bold;
              }
            }
          }
        }
      }
    }
    .button.is-float {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
    }
  }
</style>
