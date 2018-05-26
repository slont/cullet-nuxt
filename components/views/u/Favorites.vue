<template>
  <div id="userpage-favorites">
    <transition-group name="slide-fade" mode="out-in" class="columns is-multiline">
      <div v-for="theme in themes" class="column is-half" :key="theme.id">
        <theme-card :theme="theme" @open-edit-modal="$emit('open-edit-modal', theme)"/>
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
    computed: {
      urlUserId() {
        return this.$route.params.userId
      }
    },
    watch: {
      '$route.params.userId': 'refresh'
    },
    created() {
      this.refresh()
    },
    methods: {
      async refresh() {
        await this.fetch(1)
        if (this.loggedIn) {
          new FavoriteModel().find({
            themeIds: this.themes.map(theme => theme.id),
            userId: this.user.id
          }).then(res => {
            this.themes.forEach((theme, i) => Object.assign(theme, {
              favorite: !!res.data[i].themeId
            }))
          }).catch(err => console.log(err))
        }
      },
      async fetch(page) {
        if (this.themes.length < this.themesTotal) {
          const res = await new UserModel().findFavoriteThemes(this.urlUserId, {
            p: null != page ? page : Math.floor(this.themes.length / this.size) + 1,
            s: this.size
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
            if (1 === page || 0 === Math.floor(this.themes.length / this.size)) {
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
  #userpage-favorites {
    max-width: $width;

    > .columns {
      padding-top: 1em;
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
