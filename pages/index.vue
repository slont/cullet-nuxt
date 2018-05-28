<template>
  <section id="index" @scroll="infiniteScroll">
    <div class="updated-cullet-list" v-if="user.id && updatedItems.length">
      <nuxt-link :to="`/u/${user.id}`" tag="label" class="updated-cullet-label label is-size-5 has-text-white has-text-centered">
        Myカレット履歴
      </nuxt-link>
      <transition-group tag="div" name="slide-fade" mode="out-in" class="updated-cullet-list-card card item-list columns is-multiline is-gapless-only">
        <div v-for="(item, i) in updatedItems" class="updated-cullet flexbox column is-4-tablet" :key="item.id">
          <div class="updated-at text-color-weak has-text-right">
            <div class="flexbox" :class="{'is-hidden-mobile': !visibleUpdatedAt(item.updatedAt, i)}">
              <div class="updated-at-date is-size-7">{{ item.updatedAt | moment('M/D') }}</div>
              <div class="is-size-8">{{ item.updatedAt | moment('ddd') }}</div>
            </div>
          </div>

          <div class="media">
            <div class="media-content">
              <nuxt-link class="theme-title subtitle text-color-weak is-size-7" tag="div"
                           :to="`/u/${user.id}/${item.theme.id}`">
                {{ item.theme.title }}
              </nuxt-link>
              <nuxt-link class="item-title text-color-strong is-size-6 has-text-weight-bold" tag="div"
                           :to="`/u/${user.id}/${item.theme.id}/${item.id}`">
                {{ item.name }}
              </nuxt-link>
            </div>

            <div class="media-right" v-if="item.elements[0] && 'image' === item.elements[0].type && item.elements[0].valueStr">
              <figure class="image"><img :src="item.elements[0].valueStr" :srcset="`${item.elements[0].valueStr}_640w 640w`"></figure>
            </div>
            <div class="media-right" v-else-if="item.elements[1] && 'image' === item.elements[1].type && item.elements[1].valueStr">
              <figure class="image"><img :src="item.elements[1].valueStr" :srcset="`${item.elements[1].valueStr}_640w 640w`"></figure>
            </div>
          </div>
        </div>
        <div class="updated-cullet-link updated-cullet flexbox column is-4-tablet" key="link" v-if="!isMobile">
          <div class="media">
            <div class="media-content">
              <nuxt-link :to="`/u/${user.id}`" class="item-title flexbox text-color-strong is-size-5 has-text-weight-bold clickable">
                Myカレット一覧へ
                <span class="icon"><i class="fas fa-angle-double-right fa-fw"></i></span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <div class="new-cullet-list">
      <label class="new-cullet-label label is-size-5 has-text-white has-text-centered">タイムライン</label>

      <transition-group tag="div" name="slide-fade" mode="out-in" class="columns is-multiline">
        <div v-for="(key) in Object.keys(newItemsColumns)" class="column is-12-mobile is-6-tablet" :key="`column-${key}`">
          <div v-for="item in newItemsColumns[key]" class="item-list" :key="item.id" v-if="newItemsColumns[key].length">
            <nuxt-link :to="`/u/${item.theme.createdUser.id}/${item.theme.id}/${item.id}`"
                       tag="div" class="new-cullet-card card">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <nuxt-link class="theme-title subtitle text-color-weak is-size-7 clickable" tag="div"
                               :to="`/u/${item.theme.createdUser.id}/${item.theme.id}`">
                      {{ item.theme.title }}
                    </nuxt-link>
                    <div class="item-title text-color-strong is-size-5 has-text-weight-bold clickable">
                      {{ item.name }}
                    </div>

                    <div class="user-profile flexbox has-align-centered is-size-7">
                      <figure class="image circle is-16x16 flexbox" v-if="item.theme.createdUser.image">
                        <user-image :src="item.theme.createdUser.image"/>
                      </figure>
                      <nuxt-link :to="`/u/${item.theme.createdUser.id}`" class="user-name text-color-weak clickable">
                        {{ item.theme.createdUser.name }}
                      </nuxt-link>
                      <span class="updated-at text-color-weak is-size-8 is-justify-end">{{ fromNow(item.updatedAt) }}</span>
                    </div>
                  </div>

                  <div class="media-right" v-if="item.theme.image">
                    <figure class="image"><img :src="item.theme.image" :srcset="`${item.theme.image}_640w 640w`"></figure>
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
        <div class="button is-loading fullwidth is-large" key="loading" v-if="newItems.length && newItems.length < newItemsTotal"></div>
      </transition-group>
    </div>
  </section>
</template>

<script>
  import ElementView from '@/components/element/ElementView'
  const SIZE = 12

  export default {
    components: {ElementView},
    data() {
      return {
        topThemes: [],
        updatedItems: [],
        newItems: [],
        newItemsTotal: 10000
      }
    },
    asyncData({store}) {
      // console.log(store)
      // return new ItemModel().findByNew({
      return store.dispatch('modules/item/findByNew', {
        query: {p: 1, s: SIZE}
      }).then(res => {
        return {
          newItems: res.data,
          newItemsTotal: res.headers['x-page-total']
        }
      })
    },
    computed: {
      newItemsColumns() {
        if (process.browser && this.isMobile) {
          return {
            0: this.newItems,
            1: []
          }
        } else {
          return {
            0: this.newItems.filter((item, i) => 0 === i % 2),
            1: this.newItems.filter((item, i) => 1 === i % 2)
          }
        }
      }
    },
    created() {
      if (process.browser) {
        window.addEventListener('scroll', this.infiniteScroll);
      }
    },
    destroyed () {
      if (process.browser) {
        window.removeEventListener('scroll', this.infiniteScroll);
      }
    },
    methods: {
      refresh() {
        if (this.loggedIn) {
          this.$store.dispatch('modules/user/findItems', {
            id: this.user.id,
            query: {p: 1, s: 10}
          }).then(res => {
            this.updatedItems = res.data.slice(0, 5)
            this.$store.commit('SET_ITEMS', res.data)
          })
        }

        this.fetchNewItems()
      },
      fetchNewItems() {
        // new ItemModel().findByNew({
        this.$store.dispatch('modules/item/findByNew', {
          query: {p: Math.floor(this.newItems.length / SIZE) + 1, s: SIZE}
        }).then(res => {
          if (0 === Math.floor(this.newItems.length / SIZE)) {
            this.newItems = res.data
          } else {
            this.newItems.push(...res.data)
          }
          this.newItemsTotal = res.headers['x-page-total']
        })
      },
      openEditModal(theme) {
        this.$refs.themeEditModal.open(theme)
      },
      visibleUpdatedAt(updatedAt, index) {
        if (index === this.updatedItems.length - 1) {
          return true
        } else if (24 > this.$moment().diff(this.$moment(updatedAt), 'hours')) {
          return true
        }
        return 0 !== this.$moment(this.updatedItems[index + 1].updatedAt).diff(this.$moment(updatedAt), 'days')
      },
      infiniteScroll(event) {
        if (this.$el.scrollHeight <= window.scrollY + window.innerHeight && this.newItems.length < this.newItemsTotal) {
          this.fetchNewItems()
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #index {
    .updated-cullet-label,
    .new-cullet-label {
      @include label-accent-sp;
    }
    .new-cullet-label {
      &:before{
        transform: rotate(30deg);
        left: -90px;
      }
      &:after{
        transform: rotate(30deg);
        left: 113px;
      }
    }
    .new-cullet-list {
      > .columns {
        margin-top: 0;
      }
      .item-list {
        .new-cullet-card {
          &:hover {
            cursor: pointer;
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
          .user-profile {
            .image {
              margin-right: .35em;
            }
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
          .content {
            > :not(:last-child) {
              margin-bottom: 1.5em;
            }
            .view-label {
              font-size: $size-7;
              color: $text-color-weak;
            }
          }
        }
      }
    }
    .meta-data {
       display: inline-flex;
       font-size: $size-small;
       margin-left: auto;

       > figure,
       > div:not(:last-child) {
         margin-right: 3px;
       }
     }

    @media screen and (min-width: 769px) {
      .new-cullet-list {
        > .columns {
          padding: 0 1px;
        }
        .item-list {
          &:not(:last-child) {
            margin-bottom: 1.5rem;
          }
          .card {
            border-radius: 5px;
          }
        }
      }
    }

    @media screen and (max-width: 768px) {
      height: calc(100vh - #{$header-nav-height + $footer-nav-height});
      background-color: $bg-color-main;

      .updated-cullet-list {
        margin: 0;

        .updated-cullet-list-card {
          z-index: 1;
        }
        .item-list {
          padding: 0;

          .updated-cullet {
            align-items: flex-end;

            &:not(:last-child) {
              padding-bottom: 0;
            }
            &:last-child {
              .media {
                border-bottom: none;
              }
            }
            .media {
              flex: 1;
              border-bottom: $border-style;

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
              + .content {
                margin-top: 1.25em;
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
            }
          }
        }
      } // .updated-cullet-list
      .new-cullet-list {
        margin: 0;

        > .columns {
          margin: 0;

          > .column {
            padding: 0;
          }
        }
        .item-list {
          padding: 0;

          &:not(:last-child) {
            margin-bottom: 1em;
          }
          .new-cullet-card {
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
                + .content {
                  margin-top: 1.25em;
                }
              } // .media
            } // .card-content
          } // .new-cullet-card
        } // .item-list
      } // .new-cullet-list
    }
  }
</style>
