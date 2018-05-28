<template>
  <div class="theme-card card">
    <div class="card-image">
      <figure class="image is-16by9">
        <img :src="theme.image" :srcset="`${theme.image}_640w 640w`" v-if="theme.image">
        <img src="/img/cullet-logo_orange.png" class="alt-image" alt="Placeholder image" v-else>
      </figure>
      <div class="dark-mask" @click="$router.push(`/u/${theme.createdUser.id}/${theme.id}`)">
        <span class="private-icon icon is-size-3 has-text-white" v-if="theme.private"><i class="fas fa-lock"></i></span>

        <div class="title is-4 has-text-white">{{ theme.title }}</div>
        <div class="user-profile flexbox has-align-centered is-size-7">
          <figure class="image circle is-32x32 flexbox" v-if="theme.createdUser.image">
            <user-image :src="theme.createdUser.image"/>
          </figure>
          <div>
            <div @click.stop="$router.push(`/u/${theme.createdUser.id}`)">
              <span class="user-name has-text-white has-text-weight-bold">
                {{ theme.createdUser.name }}</span><span class="user-id has-text-grey-lighter">@{{ theme.createdUser.id }}</span>
            </div>
            <div class="updated-at has-text-grey-lighter" v-if="theme.updatedAt">
              <span class="icon"><i class="far fa-clock"></i></span>
              {{ fromNow(theme.updatedAt, 'YYYY/MM/DD HH:mm') }}
            </div>
          </div>
        </div>
      </div>

      <a class="add-item-button button is-info is-rounded" v-if="isMyTheme && visibleAddItem">カレット新規追加</a>
    </div>

    <div class="card-content media">
      <div class="media-content">
        <div class="theme-tags tags" v-if="theme.tags.length">
          <el-tag v-for="tag in theme.tags" :key="tag.tagId" type="warning"
                  @click.native.stop="$router.push(`/tag?name=${tag.name}`)">
            #{{ tag.name }}
          </el-tag>
        </div>

        <div class="theme-description content is-size-7" v-if="theme.description">{{ theme.description }}</div>

        <nav class="actions level is-mobile is-size-4">
          <div class="level-left">
            <a class="favorite-action level-item" :class="{ 'is-active': theme.favorite }">
              <span class="icon" @click.stop.prevent="onClickFavorite">
                <i class="fa-heart fa-pull-left" :class="[theme.favorite ? 'fas' : 'far']"></i>
              </span>
              <span class="favorite-count count has-text-weight-bold" v-if="theme.favoriteCount">
                {{ theme.favoriteCount }}
              </span>
            </a>
            <a class="item-action level-item">
              <span class="icon"><i class="fas fa-list-ul fa-pull-left"></i></span>
              <span class="item-count count has-text-weight-bold">{{ theme.itemCount }}</span>
            </a>
          </div>
          <div class="level-right">
            <a class="edit-action level-item">
              <span class="icon is-size-3" @click.stop.prevent="$emit('open-edit-modal')" v-if="loggedIn && isMyTheme">
                <i class="material-icons">more_horiz</i>
              </span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      theme: Object,
      visibleAddItem: Boolean
    },
    computed: {
      urlUserId() {
        return this.$route.params.userId
      },
      isMyTheme() {
        return this.$store.state.user.id === this.theme.createdUser.id
      }
    },
    methods: {
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
          return this.$store.dispatch('modules/theme/deleteFavorite', {id: this.theme.id, userId: this.user.id})
        } else {
          return this.$store.dispatch('modules/theme/updateFavorite', {id: this.theme.id, userId: this.user.id})
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .theme-card {
    .card-image {
      overflow: visible;

      .image {
        overflow: hidden;
      }
      .dark-mask {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        padding: 1rem;
        background: linear-gradient(rgba(0, 0, 0, .1), rgba(0, 0, 0, .6));
        transition: all .3s ease;

        &:hover {
          background: linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .7));
          cursor: pointer;
        }
        .private-icon {
          position: absolute;
          top: .25rem;
          left: 1rem;
          height: 3rem;
          color: #e8e8e8;
        }
        .title {
          max-height: 80px;
          width: 100%;
          margin: 0;
          margin-bottom: 1rem;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          color: white;

          &:hover {
            text-decoration: underline;
          }
        }
        .user-profile {
          cursor: pointer;

          .image {
            margin-right: .5em;
          }
          .user-name {
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
      .add-item-button,
      .add-button {
        position: absolute;
        bottom: 1em;
        right: 1em;

        &:not(:hover) {
          color: #409eff;
          background: #ecf5ff;
          border-color: #b3d8ff;
        }
      }
    }
    .card-content.media {
      .media-content {
        overflow: initial;

        .theme-description + .actions {
          padding-top: .5em;
          border-top: $border-style;
        }
        .actions {
          .level-item {
            display: flex;
            align-items: center;
            color: darkgrey;

            .icon {
              font-size: $size-5;
            }
          }
          .favorite-action {
            &:hover {
              opacity: .8;
            }
            &.is-active {
              color: deeppink;
            }
          }
          .edit-action {
            margin-right: 0;
          }
        }
      }
    }
  }
</style>
