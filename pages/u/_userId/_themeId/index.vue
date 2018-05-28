<template>
  <div id="user-theme">
    <theme-card :theme="theme"
                @open-edit-modal="$refs.themeEditModal.open(theme)"
                @refresh="refresh"/>

    <div class="theme-items">
      <div class="label is-size-5 has-text-white has-text-centered">
        <span>カレット一覧</span>
      </div>
      <transition-group tag="div" name="slide-fade" mode="out-in" class="columns is-multiline">
        <div v-for="(key) in Object.keys(itemsColumns)" class="column is-12-mobile is-6-tablet" :key="`column-${key}`">
          <div v-for="item in itemsColumns[key]" class="item-list" :key="item.id" v-if="itemsColumns[key].length">
            <nuxt-link :to="`/u/${urlUserId}/${theme.id}/${item.id}`"
                         tag="div" class="cullet-card card">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <nuxt-link class="theme-title subtitle text-color-weak is-size-7 clickable" tag="div"
                                 :to="`/u/${urlUserId}/${theme.id}`">
                      {{ theme.title }}
                    </nuxt-link>
                    <div class="item-title text-color-strong is-size-5 has-text-weight-bold clickable">
                      {{ item.name }}
                    </div>
                    <div class="updated-at text-color-weak is-size-8">
                      <span class="icon"><i class="far fa-clock"></i></span>
                      <span>{{ fromNow(item.updatedAt) }}</span>
                    </div>
                  </div>
                </div>

                <div class="content" v-if="item.elements.length">
                  <element-view :element="item.elements[0]"/>
                  <element-view :element="item.elements[1]" v-if="item.elements[1]"/>
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>
      </transition-group>
    </div>

    <a @click="$refs.itemCreateModal.open(theme)" v-if="loggedIn"
       class="button button-create is-float is-info circle is-hidden-mobile">
      <i class="material-icons">add</i>
    </a>

    <theme-edit-modal ref="themeEditModal" @refresh="refresh"/>
    <item-create-modal ref="itemCreateModal" @refresh="refresh"/>
    <item-edit-modal ref="itemEditModal" @refresh="refresh"/>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import ElementView from '@/components/element/ElementView'
  import ThemeCard from '@/components/theme/ThemeCard'
  import ItemCard from '@/components/item/ItemCard'
  import ThemeEditModal from '@/components/theme/ThemeEditModal'
  import ItemCreateModal from '@/components/item/ItemCreateModal'
  import ItemEditModal from '@/components/item/ItemEditModal'

  export default {
    components: { ElementView, ThemeCard, ThemeEditModal, ItemCreateModal, ItemEditModal, ItemCard },
    data() {
      return {
        theme: {
          title: '',
          items: [],
          tags: [],
          favorite: false,
          createdUser: {
            id: '',
            name: '',
            image: ''
          }
        },
        currentItem: {
          id: ''
        },
        openedThemeDescription: false
      }
    },
    computed: {
      selfUser() {
        return this.$store.state.user
      },
      urlUserId() {
        return this.$route.params.userId
      },
      itemId() {
        return this.$route.params.itemId
      },
      isMyPage() {
        return this.$store.state.user.id === this.urlUserId
      },
      themeId() {
        return this.$route.params.themeId
      },
      itemsColumns() {
        if (this.isMobile) {
          return {
            0: this.theme.items,
            1: []
          }
        } else {
          return {
            0: this.theme.items.filter((item, i) => 0 === i % 2),
            1: this.theme.items.filter((item, i) => 1 === i % 2)
          }
        }
      }
    },
    watch: {
      itemId() {
        this.refreshItem(this.itemId)
      }
    },
    created() {
      this.refresh()
    },
    methods: {
      refresh() {
        const itemId = this.itemId
        const themeModel = new ThemeModel()
        themeModel.findOne(this.themeId).then(async res1 => {
          Object.assign(this.theme, res1.data)

          if (itemId) {
            await this.refreshItem(itemId)
          } else if (this.theme.items.length) {
            this.currentItem = this.theme.items[0]
          }
          if (this.loggedIn) {
            const res2 = await themeModel.findOneFavorite(this.theme.id, this.selfUser.id).catch(err => {
              if (401 === err.status) this.$store.dispatch('signout')
            })
            this.theme.favorite = res2.data && !!res2.data.themeId
          }
        }).catch(() => {
          this.$router.replace(`/u/${this.urlUserId}`)
        })
      },
      async refreshItem(itemId) {
        this.$store.commit('modules/item/init', {themeId: this.theme.id})
        await this.$store.dispatch('modules/item/findOne', {id: itemId}).then(res => {
          this.currentItem = res.data
          this.$nextTick(() => {
            window.scrollTo(0, 0)
          })
        })
      },
      onClickFavorite() {
        if (this.loggedIn) {
          this.doFavorite().then(res => {
            this.theme.favoriteCount += this.theme.favorite ? -1 : 1
            this.theme.favorite = !this.theme.favorite
          })
        } else {
          this.$confirm('アカウントを作成すると、テーマをお気に入りに追加できるようになります！', '', {
            type: 'info',
            showCancelButton: false,
            showConfirmButton: false
          })
        }
      },
      doFavorite() {
        if (this.theme.favorite) {
          return new ThemeModel().deleteFavorite(this.theme.id, this.selfUser.id)
        } else {
          return new ThemeModel().updateFavorite(this.theme.id, this.selfUser.id)
        }
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
  #user-theme {
    background-color: $bg-color-main;

    .theme-items {
      > .label {
        @include label-accent-sp;
      }
      .item-list {
        padding: 0;
        margin: 0 0 1em;

        .card-content {
          .media {
            margin-bottom: .25em;

            .media-content {
              > :not(:last-child) {
                margin-bottom: .3em;
              }
              .theme-title {
                height: 1rem;
                overflow: hidden;
              }
              .item-title {
                display: flex;
                max-height: 2.5em;
                line-height: 1.25;
                overflow: hidden;
              }
            }
            .media-right {
              .image {
                height: 60px;
                overflow: hidden;

                img {
                  height: 100%;
                  width: auto;
                }
              }
            }
            + .content {
              margin-top: 1.5em;
            }
          } // .media
          .content {
            > :not(:last-child) {
              margin-bottom: 1.5em;
            }
            .view-label {
              font-size: $size-7;
              color: $text-color-weak;
            }
            .element-view {
              .text-element {
                .control {
                  max-height: 164px;
                  overflow: hidden;

                  .value {
                    font-size: $size-6;
                  }
                }
              }
              .image-element {
                .file-view {
                  display: flex;
                  align-items: center;
                  max-height: 24em;
                  margin: 0;
                  overflow: hidden;
                }
              }
            }
          }
        } // .card-content
      } // .item-list
    }
    .fixed-action-button {
      position: fixed;
      bottom: 2rem;
      right: 2rem;

      &.vertical ul {
        position: absolute;
        display: inline-flex;
        flex-direction: column-reverse;
        align-items: center;
        justify-content: flex-start;
        bottom: 0;
        height: 500px;
        width: 100%;
        padding-bottom: 64px;
        visibility: hidden;

        li {
          .button {
            height: 40px;
            width: 40px;
            margin: .5rem;
          }
        }
        &:hover {
          visibility: visible;
        }
      }
      .trigger-button {
        z-index: 100;

        .material-icons {
          transition: all .3s;
        }
      }
      &:hover {
        .trigger-button {
          .material-icons {
            transform: rotate(-135deg);
          }
          + ul {
            visibility: visible;
          }
        }
      }
    }
    .button.is-float {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
    }

    @media screen and (min-width: 769px) {
      .theme-card {
        max-width: 540px;
        margin: 0 auto;
      }
    }

    @media screen and (max-width: 768px) {
      .theme-content {
        width: 100%;
        margin: 0;

        .theme-columns {
          > .main-column {
            padding: 1.5rem 1rem;
          }
          .hidden-mobile-only {
            display: none;
          }
        }
      }
      .columns {
        margin: 0;

        .column {
          padding: 0;
        }
      }
    }
  }
</style>
