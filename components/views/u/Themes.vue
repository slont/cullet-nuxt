<template>
  <div id="userpage-themes">
    <transition-group name="slide-fade" mode="out-in" class="columns is-multiline">
      <div v-for="theme in themes" class="column is-half" :key="theme.id">
        <theme-card :theme="theme"
                    @open-edit-modal="$emit('open-edit-modal', theme)"
                    @refresh="refresh"/>
      </div>
      <div class="button is-loading fullwidth is-large" key="loading" v-if="themes.length < themesTotal"></div>
    </transition-group>
  </div>
</template>

<script>
  import UserModel from '@/models/User'
  import FavoriteModel from '@/models/Favorite'
  import ThemeCard from '@/components/theme/ThemeCard'
  const SIZE = 10

  export default {
    components: { ThemeCard },
    data() {
      return {
        themes: [],
        size: SIZE,
        themesTotal: 10000
      }
    },
    asyncData({params}) {
      return new UserModel().findThemes(this.urlUserId, {
        p: 1,
        s: SIZE
      }).then(res => {
        return {
          themes: res.data.map(theme => {
            theme.favorite = false
            return theme
          }),
          themesTotal: res.headers['x-page-total']
        }
      })
    },
    computed: {
      urlUserId() {
        return this.$route.params.userId
      }
    },
    watch: {
      '$route.params.userId': 'refresh'
    },
    created() {
      if (this.urlUserId === this.user.id) {
        Object.assign(this.themes, this.$store.state.themes.slice(0, SIZE))
      }
      this.refresh()
    },
    methods: {
      async refresh() {
        await this.fetch(1)
        if (this.loggedIn && this.urlUserId === this.user.id) {
          this.$store.commit('SET_THEMES', this.themes)
        }
        // if (this.loggedIn) {
          new FavoriteModel().find({
            themeIds: this.themes.map(theme => theme.id),
            userId: 'slont'
          }).then(res => {
            this.themes.forEach((theme, i) => Object.assign(theme, {
              favorite: !!res.data[i].themeId
            }))
          }).catch(err => {
            if (401 === err.status) this.$store.dispatch('signout')
          })
        // }
      },
      async fetch(page) {
        if (this.themes.length < this.themesTotal) {
          const res = await new UserModel().findThemes(this.urlUserId, {
            p: null != page ? page : Math.floor(this.themes.length / SIZE) + 1,
            s: SIZE
          }).catch(err => {
            console.log(err)
            this.$message({
              showClose: true,
              message: 'データ取得に失敗しました',
              type: 'error'
            })
          })
          if (res.data) {
            const themes = res.data.map(theme => {
              theme.favorite = false
              return theme
            })
            if (1 === page || 0 === Math.floor(this.themes.length / SIZE)) {
              this.themes = themes
            } else {
              this.themes.push(...themes)
            }
            this.themesTotal = res.headers['x-page-total']
          }
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userpage-themes {
    max-width: $width;
    margin: 0 auto;

    > .columns {
      padding-top: 1em;
    }

    @media screen and (min-width: 769px) {
      .theme-card {
        border-radius: 5px;
        .card-image > .image,
        .dark-mask {
          border-top-right-radius: 5px;
          border-top-left-radius: 5px;
        }
      }
    }

    @media screen and (max-width: 768px) {
      .columns {
        margin: 0;

        .column {
          padding: 0;
        }
      }
    }
  }
</style>
