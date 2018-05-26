<template>
  <div id="userpage-item">
    <div class="scrollable-container" @scroll="onScrollContainer">
      <nuxt-link :to="`/u/${urlUserId}/${themeId}`" tag="div"
                   class="theme-title is-size-7 has-text-underline text-color-weak clickable">
        {{ theme.title }}
      </nuxt-link>
      <div class="theme-tags tags is-size-8" v-if="theme.tags.length">
        <el-tag v-for="tag in theme.tags" :key="tag.tagId" type="warning" class="clickable"
                @click.native="$router.push(`/tag?name=${tag.name}`)">
          #{{ tag.name }}
        </el-tag>
      </div>
      <div class="user-profile flexbox has-align-centered is-size-7">
        <figure class="image circle is-16x16 flexbox" v-if="theme.createdUser.image">
          <user-image :src="theme.createdUser.image"/>
        </figure>
        <div @click.stop="$router.push(`/u/${theme.createdUser.id}`)">
          <span class="user-name clickable">{{ theme.createdUser.name }}</span><span class="user-id text-color-weak">@{{ theme.createdUser.id }}</span>
        </div>
      </div>

      <div class="cullet-container">
        <transition :name="transition">
          <div v-for="item in items" class="cullet-content" v-if="currentItem.id === item.id" :key="item.id">
            <div class="cullet-info">
              <div class="updated-at text-color-weak is-size-7 has-text-right" v-if="item.updatedAt">
                <span class="icon"><i class="far fa-clock"></i></span>
                {{ fromNow(item.createdAt, 'YYYY/MM/DD HH:mm') }}
                <span class="is-size-8" v-if="1 < $moment(item.updatedAt).diff($moment(item.createdAt), 'hours')">
                  ({{ item.updatedAt | moment('YYYY/MM/DD HH:mm') }} 更新)
                </span>
              </div>
              <div class="title is-3">
                {{ item.name }}

                <template v-if="loggedIn && isMyPage">
                  <a class="edit-button button is-info is-outlined is-size-7" v-if="isMobile"
                     @click="$router.push(`/m/editItem/${theme.id}/${item.id}`)">
                    <span class="icon"><i class="material-icons">edit</i></span>
                    <span>編集</span>
                  </a>
                  <a class="edit-button button is-info is-outlined" v-else
                     @click="$refs.itemEditModal.open(theme, item)">
                    <span class="icon"><i class="material-icons">edit</i></span>
                    <span>編集</span>
                  </a>
                </template>
              </div>
            </div>

            <div class="item-elements">
              <div v-for="(element, i) in currentItem.elements" :key="i" class="field element-field">
                <element-view :element="element"/>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div class="social-sharing" :class="{ 'is-active': activePagination }">
      <social-sharing :url="href" :title="`${currentItem.name} | Cullet (カレット)`" inline-template>
        <div>
          <!--<network network="facebook">
            <span class="facebook-icon icon circle is-size-1">
              <i class="fab fa-facebook-f fa-fw is-size-4"></i>
            </span>
          </network>-->
          <network network="twitter">
            <span class="twitter-icon is-48x48 icon circle">
              <i class="fab fa-twitter fa-fw is-size-3"></i>
            </span>
          </network>
        </div>
      </social-sharing>
    </div>

    <div class="cullet-pagination flexbox fullwidth has-text-white clickable" :class="{ 'is-active': activePagination }">
      <div @click="next" class="next cullet-pagination-item flexbox" v-if="currentItem.next.id">
        <span class="icon is-size-3"><i class="fa fas fa-chevron-left"></i></span>
        <div class="cullet-name is-size-6">{{ currentItem.next.name }}</div>
      </div>
      <div @click="prev" class="prev cullet-pagination-item flexbox is-justify-end has-text-right clickable" v-if="currentItem.prev.id">
        <div class="cullet-name is-size-6 is-justify-end has-text-left">{{ currentItem.prev.name }}</div>
        <span class="icon is-size-3"><i class="fa fas fa-chevron-right"></i></span>
      </div>
    </div>

    <item-edit-modal ref="itemEditModal" @refresh="refresh"/>
  </div>
</template>

<script>
  import ThemeModel from '@/models/Theme'
  import ItemModel from '@/models/Item'
  import ItemEditModal from '@/components/item/ItemEditModal'
  import ElementView from '@/components/element/ElementView'

  export default {
    components: { ItemEditModal, ElementView },
    data() {
      return {
        theme: {
          id: '',
          title: '',
          tags: [],
          createdUser: {
            id: '',
            name: '',
            image: ''
          }
        },
        currentItem: {
          id: '',
          name: '',
          elements: [],
          prev: {
            id: '',
            name: ''
          },
          next: {
            id: '',
            name: ''
          }
        },
        items: [],
        currentIndex: 0,
        transition: 'slide-fade',
        scrolledTop: 0,
        activePagination: false
      }
    },
    computed: {
      urlUserId() {
        return this.$route.params.userId
      },
      themeId() {
        return this.$route.params.themeId
      },
      itemId() {
        return this.currentItem.id || this.$route.params.itemId
      },
      isMyPage() {
        return this.user.id === this.urlUserId
      },
      innerHeight() {
        return this.$el.querySelector('.scrollable-container').scrollHeight - this.$el.querySelector('.scrollable-container').clientHeight
      },
      href() {
        return process.browser ? location.href : ''
      }
    },
    mounted() {
      this.init()
    },
    async beforeRouteUpdate(to, from, next) {
      if (this.itemId !== to.params.itemId) {
        await this.refresh({
          id: to.params.itemId
        })
      }
      next()
    },
    methods: {
      async init() {
        new ItemModel(this.themeId).findOne(this.itemId).then(res => {
          Object.assign(this.currentItem, res.data)
          if (res.data.next.id) {
            this.items.push(res.data.next)
          }
          this.items.push(res.data)
          if (res.data.prev.id) {
            this.items.push(res.data.prev)
          }

          this.$nextTick(() => {
            if (80 > this.$el.querySelector('.scrollable-container').scrollHeight - this.$el.querySelector('.scrollable-container').clientHeight) {
              this.activePagination = true
            }
          })
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: 'データ取得に失敗しました',
            type: 'error'
          })
        })
        new ThemeModel().findOne(this.themeId).then(res => {
          Object.assign(this.theme, res.data)
        })
      },
      async refresh(item, transition = 'slide-fade') {
        this.transition = transition
        await new ItemModel(this.themeId).findOne(item.id).then(res => {
          Object.assign(this.currentItem, res.data)
          const first = this.items[0]
          if (first.id === res.data.id) {
            this.items.unshift(res.data.next)
          }
          const last = this.items[this.items.length - 1]
          if (last.id === res.data.id) {
            this.items.push(res.data.prev)
          }
          setTimeout(() => this.scrollToTop(300), 400)
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: 'データ取得に失敗しました',
            type: 'error'
          })
        })
      },
      async next() {
        const itemId = this.currentItem.next.id
        await this.refresh(this.currentItem.next, 'show-next')
        this.$router.push(`/u/${this.urlUserId}/${this.themeId}/${itemId}`)
      },
      async prev() {
        const itemId = this.currentItem.prev.id
        await this.refresh(this.currentItem.prev, 'show-prev')
        this.$router.push(`/u/${this.urlUserId}/${this.themeId}/${itemId}`)
      },
      onScrollContainer() {
        const scrollTop = this.$el.querySelector('.scrollable-container').scrollTop
        if (80 > this.innerHeight - scrollTop) {
          this.activePagination = true
        } else {
          this.activePagination = scrollTop < this.scrolledTop
        }
        this.scrolledTop = scrollTop
      },
      scrollToTop(scrollDuration) {
        const scrollHeight = this.$el.querySelector('.scrollable-container').scrollTop
        const scrollStep = Math.PI / (scrollDuration / 15)
        const cosParameter = scrollHeight / 2
        let scrollCount = 0
        let scrollMargin
        let scrollInterval = setInterval(() => {
          if (0 !== this.$el.querySelector('.scrollable-container').scrollTop) {
            scrollCount = scrollCount + 1
            scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep)
            this.$el.querySelector('.scrollable-container').scrollTop = scrollHeight - scrollMargin
          } else clearInterval(scrollInterval)
        }, 15)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #userpage-item {
    max-width: 680px;
    margin: auto;

    .scrollable-container {
      padding: 1rem;
      overflow-y: scroll;
      -webkit-overflow-scrolling : touch;

      .theme-title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
    }
    .theme-tags {
      margin-top: .5em;
      margin-bottom: 0;
    }
    .user-profile {
      margin-top: .5em;

      .image {
        margin-right: .5em;
      }
    }
    .cullet-container {
      position: relative;
      min-height: 80vh;

      .cullet-content {
        position: absolute;
        width: 100%;

        > :last-child {
          margin-bottom: 120px;
        }
        .cullet-info {
          margin-bottom: 2rem;
          border-bottom: $border-style;

          .title {
            margin-bottom: .25em;
          }
          .subtitle {
            line-height: inherit;
          }
        }
        .item-elements {
          .element-field:not(:last-child) {
            margin-bottom: 2em;
          }
        }
      }
    }

    .social-sharing {
      position: fixed;
      right: -50px;
      bottom: $footer-nav-height * 2.5;
      z-index: 1;
      transition: right .4s;

      &.is-active {
        right: 1em;
      }
      .icon {
        $size: 48px;
        height: $size;
        width: $size;
        border-width: 2px;
        border-style: solid;
        transition: color .1s, background-color .2s;

        &:hover {
          color: white;
        }
      }
      .facebook-icon {
        $color: #3B5998;
        color: $color;
        border-color: $color;

        &:hover {
          background-color: $color;
        }
      }
      .twitter-icon {
        $color: #55acee;
        color: $color;
        border-color: $color;

        &:hover {
          background-color: $color;
        }
      }
    }
    .cullet-pagination {
      position: fixed;
      left: 0;
      bottom: -$footer-nav-height * 3;
      height: 4.5em;
      z-index: 1;
      transition: bottom .35s;

      &.is-active {
        bottom: $footer-nav-height;
      }
      &-item {
        height: 4.5em;
        width: 46%;
        max-width: 14em;
        padding: 0 .5em;
        background-color: rgba($link, .6);

        .cullet-name {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          padding: 0 .5em;
          overflow: hidden;
          line-height: 1.25;
        }
        &.next {
          border-top-right-radius: $size-1;
          border-bottom-right-radius: $size-1;
        }
        &.prev {
          border-top-left-radius: $size-1;
          border-bottom-left-radius: $size-1;
        }
      }
    }

    .show-next-enter-active, .show-next-leave-active,
    .show-prev-enter-active, .show-prev-leave-active  {
      transition: all .4s;
    }
    .show-next-enter, .show-prev-leave-to {
      transform: translateX(-100%);
    }
    .show-next-leave-to, .show-prev-enter {
      transform: translateX(100%);
    }
  }
</style>
