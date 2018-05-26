<template>
  <div class="item-card card">
    <div class="card-content">
      <div class="media has-align-centered">
        <div class="media-content">
          <div class="updated-at text-color-weak is-size-8 has-text-right">
            {{ fromNow(item.updatedAt) }}
          </div>
          <nuxt-link class="item-title flexbox text-color-strong is-size-5 has-text-weight-bold" tag="div"
                       :to="`/u/${theme.createdUser.id}/${theme.id}/${item.id}`">
            {{ item.name }}
          </nuxt-link>
        </div>
      </div>
      <div class="content is-size-7" v-if="item.elements.length">
        <element-view :element="item.elements[0]"/>
        <element-view :element="item.elements[1]" v-if="item.elements[1]"/>
      </div>
    </div>
  </div>
</template>

<script>
  import ElementView from '@/components/element/ElementView'

  export default {
    components: { ElementView },
    props: ['theme', 'item'],
    computed: {
      urlUserId() {
        return this.$route.params.userId
      },
      isMyPage() {
        return this.$store.state.user.id === this.urlUserId
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .item-card {
    width: 100%;
    cursor: pointer;

    &.card .media:not(:last-child) {
      margin-bottom: .5rem;
    }
    .card-content {
      .media {
        $size: 3.5rem;
        max-height: $size;

        .media-content {
          overflow: hidden;

          .item-title {
            max-height: 2.5em;
            line-height: 1.25;
            overflow: hidden;
          }
        }
      }
      .content {
        background-color: rgba(255, 255, 255, .8);
        overflow: hidden;

        &:not(:last-child) {
          margin-bottom: 0;
        }
        .cl-element {
          .view-label {
            font-size: $size-7;
            color: $text-color-weak;
          }
          figure {
            display: flex;
            align-items: center;
            height: 18em;
            margin: 0 0 -1em 0;
            overflow: hidden;

            img {
              width: 100%;
            }
          }
        }
      }
      .edit-button {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        border-width: 3px;
        border-radius: 0;
        opacity: 0;

        &.is-primary.is-outlined {
          background-color: white;
        }
        .icon i {
          font-size: $size-5;
        }
      }
      &:hover .edit-button {
        opacity: 1;

        &:not(:hover) {
          color: #409eff;
          background: #ecf5ff;
        }
        &:hover.is-primary.is-outlined {
          background-color: $primary;
        }
      }
    }
  }
</style>
