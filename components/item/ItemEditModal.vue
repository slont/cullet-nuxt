<template>
  <modal id="item-edit-modal" class="modal" :class="`page-${pageIndex}`" ref="itemEditModal" @close="reset">
    <div class="modal-card-body">
      <div class="columns is-gapless">
        <div class="left-column column is-hidden-mobile">
          <div class="slider">
            <cl-buttons @add="addElement" class="is-centered"/>
          </div>
        </div>

        <div class="main-column column">
          <div class="theme-dropdown dropdown is-primary">
            <div class="dropdown-trigger">
              <a class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>{{ theme.title }}</span>
                <span class="icon is-small"><i class="material-icons">arrow_drop_down</i></span>
              </a>
            </div>
          </div>

          <article class="media">
            <div class="media-content">
              <div class="content">
                <div class="field">
                  <div class="item-name control">
                    <input v-model.trim="item.name" class="input title is-3" type="text" placeholder="カレット名" name="itemName"
                           v-validate="'required'" :class="{ 'is-danger': errors.has('itemName') }">
                    <span v-show="errors.has('itemName')" class="help is-danger">{{ errors.first('itemName') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div class="item-elements">
            <div v-for="(element, i) in item.elements" :key="i" class="field element-field flexbox has-align-centered">
              <div class="sort-buttons flexbox">
                <a class="button up-button is-white" @click="upOrder(i)"><i class="material-icons">arrow_upward</i></a>
                <span class="element-order">{{ element.order + 1 }}</span>
                <a class="button down-button is-white" @click="downOrder(i)"><i class="material-icons">arrow_downward</i></a>
              </div>

              <text-element :params="element" v-if="'text' === element.type" editable/>
              <image-element :params="element" v-else-if="'image' === element.type" editable/>
              <location-element :params="element" v-else-if="'location' === element.type" editable/>
              <twitter-element :params="element" v-else-if="'twitter' === element.type" editable/>
              <instagram-element :params="element" v-else-if="'instagram' === element.type" editable/>
              <datetime-element :params="element" v-else-if="'date' === element.type" editable/>
              <datetime-element :params="element" v-else-if="'time' === element.type" editable/>
              <datetime-element :params="element" v-else-if="'datetime' === element.type" editable/>
              <tag-element :params="element" v-else-if="'tag' === element.type" editable/>
              <link-element :params="element" v-else-if="'link' === element.type" editable/>
              <phone-element :params="element" v-else-if="'phone' === element.type" editable/>
              <email-element :params="element" v-else-if="'email' === element.type" editable/>
              <rating-element :params="element" v-else-if="'rating' === element.type" editable/>
              <switch-element :params="element" v-else-if="'switch' === element.type" editable/>

              <a @click="removeElement(i)" class="delete"></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="modal-card-foot has-right">
      <a @click="$refs.itemDeleteModal.open(item)" class="button is-danger is-outlined is-left">削除</a>

      <label class="checkbox">
        <input v-model="isTemplate" type="checkbox">
        テンプレート登録
      </label>
      <a @click="close" class="button">キャンセル</a>
      <guard-button :click="ok" class="is-info">保存</guard-button>
    </footer>

    <item-delete-modal ref="itemDeleteModal" @refresh="refreshClose"/>
  </modal>
</template>

<script>
  import Modal from '@/components/Modal'
  import ClButtons from '@/components/element/button/ClButtons'
  import TextElement from '@/components/element/TextElement'
  import ImageElement from '@/components/element/ImageElement'
  import LocationElement from '@/components/element/LocationElement'
  import TwitterElement from '@/components/element/TwitterElement'
  import InstagramElement from '@/components/element/InstagramElement'
  import DatetimeElement from '@/components/element/DatetimeElement'
  import TagElement from '@/components/element/TagElement'
  import LinkElement from '@/components/element/LinkElement'
  import PhoneElement from '@/components/element/PhoneElement'
  import EmailElement from '@/components/element/EmailElement'
  import RatingElement from '@/components/element/RatingElement'
  import SwitchElement from '@/components/element/SwitchElement'
  import ItemDeleteModal from './ItemDeleteModal'

  export default {
    components: {
      Modal,
      ClButtons,
      TextElement,
      ImageElement,
      LocationElement,
      TwitterElement,
      InstagramElement,
      DatetimeElement,
      TagElement,
      LinkElement,
      PhoneElement,
      EmailElement,
      RatingElement,
      SwitchElement,
      ItemDeleteModal
    },
    data() {
      return {
        pageIndex: 0,
        draggingElement: null,
        theme: {
          id: '',
          title: ''
        },
        item: {
          name: '',
          description: '',
          image: '',
          elements: []
        },
        templates: [],
        isTemplate: false,
        errorMessage: ''
      }
    },
    computed: {
      themeId() {
        return this.$route.params.themeId
      }
    },
    methods: {
      open(theme, item) {
        this.theme = theme
        this.item = item
        this.$store.commit('modules/item/init', {themeId: theme.id})
        this.$store.dispatch('modules/item/findOne', {id: this.item.id}).then(res => {
          this.item = res.data
          this.$refs.itemEditModal.open()
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: 'データ取得に失敗しました',
            type: 'error'
          })
        })
      },
      close() {
        this.reset()
        this.$refs.itemEditModal.close()
      },
      async ok() {
        await this.$validator.validateAll().then(async result => {
          if (!result) return

          this.setOrder()
          const body = Object.assign({
            isTemplate: this.isTemplate
          }, this.item)

          this.$store.commit('modules/item/init', {themeId: this.themeId})
          await this.$store.dispatch('modules/item/update', {id: this.item.id, data: body}).catch(err => {
          // await new ItemModel(this.themeId).update(this.item.id, body).catch(err => {
            this.errorMessage = err
          })

          this.$emit('refresh')
          this.$message({
            showClose: true,
            message: '保存されました',
            type: 'success'
          })
          this.close()
        })
      },
      reset() {
        Object.assign(this.$data, this.$options.data.call(this))
        this.$nextTick(() => this.errors.clear())
      },
      refreshClose() {
        this.$emit('refresh')
        this.close()
      },
      addElement(element) {
        this.item.elements.push(element)
        this.setOrder()
        this.$nextTick(() => {
          const container = this.$el.querySelector('.main-column')
          container.scrollTop = container.scrollHeight
        })
      },
      removeElement(i) {
        this.item.elements.splice(i, 1)
        this.setOrder()
      },
      setOrder() {
        let i = 0
        this.item.elements = this.item.elements.map(element => {
          element.order = i++
          return element
        })
      },
      upOrder(i) {
        const element = this.item.elements[i]
        this.item.elements.splice(i, 1, this.item.elements[i - 1])
        this.item.elements.splice(i - 1, 1, element)
        this.setOrder()
      },
      downOrder(i) {
        const element = this.item.elements[i]
        this.item.elements.splice(i, 1, this.item.elements[i + 1])
        this.item.elements.splice(i + 1, 1, element)
        this.setOrder()
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #item-edit-modal {
    $button-count: 9;

    > .modal-card {
      display: flex;
      flex-direction: column;
      height: 95%;
      width: 80%;
      transition: width .3s, height .3s;

      .modal-card-body {
        height: 100%;
        padding-bottom: 0;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;

        .columns {
          height: 100%;

          .left-column {
            height: 100%;
            max-width: calc(#{$element-button-size} + 1rem);

            .slider {
              height: 100%;
              width: 100%;
              padding: 0;
              overflow-y: scroll;
              -webkit-overflow-scrolling : touch;

              > .buttons {
                flex-direction: column;
                width: $element-button-size;

                .button:not(:last-child) {
                  margin-right: 0;
                  margin-bottom: -1px;
                }
                .subtitle {
                  margin-bottom: .5em;
                  color: grey;
                }
                .buttons-label:not(:first-child) {
                  margin-top: 1.5em;
                }
              }
            }
          }
          .main-column {
            $sort-button-size: 2rem;
            $margin-side: $sort-button-size + .5rem;
            padding: 0 0 1.5rem 3rem !important;
            background-color: white;
            overflow-y: scroll;
            -webkit-overflow-scrolling : touch;
            z-index: 0;

            .theme-dropdown {
              width: 100%;

              .dropdown-trigger {
                width: 100%;

                .button {
                  max-width: 70%;

                  :first-child {
                    max-width: 95%;
                    overflow: hidden;
                  }
                  .icon {
                    margin-left: auto;
                  }
                }
              }
            }
            .item-name {
              padding: 0;
              margin-bottom: 1rem;

              .input {
                border-top: none;
                border-right: none;
                border-left: none;
                border-bottom-width: 2px;
                border-radius: 0;
                box-shadow: none;
                height: 3rem;
                margin-bottom: 0;
                padding: 0;
                line-height: 3rem;
              }
            }
            .item-elements {
              margin-left: -$margin-side;
              margin-right: -$margin-side;

              .element-field {
                .sort-buttons {
                  flex: .025;
                  flex-direction: column;

                  .button {
                    width: 2rem;
                    border: none;

                    .material-icons {
                      color: gainsboro;
                    }
                  }
                  .element-order {
                    font-size: .75em;
                    color: darkgrey;
                    text-align: center;
                  }
                }
                .cl-element {
                  flex: .9;
                  padding: 0 .5rem;
                }
                .delete {
                  flex: .05;
                }
                &:first-child {
                  .up-button {
                    visibility: hidden;
                    background-color: black;
                  }
                }
                &:last-child {
                  .down-button {
                    visibility: hidden;
                  }
                }
                &:not(:last-child) {
                  margin-bottom: .25rem;
                }
              }
            }
          }
          .right-column {
            max-width: 256px;

            .image-field {
              .field-body {
                width: 192px;
                display: flex;
                flex-direction: column;

                .file-view {
                  .delete {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    z-index: 10;
                  }
                  + .file {
                    position: absolute;
                    top: 0;
                    opacity: .7;
                  }
                }
              }
            }
          }
        }
      }
      .modal-card-body.slider {
        height: $element-button-size + 1rem;
        width: 100%;
        margin: 0;
        padding: 0;
        border-radius: 0;
        overflow: scroll;
        -webkit-overflow-scrolling : touch;

        .buttons {
          width: $element-button-size * $button-count;

          .el-button {
            margin-bottom: 0;
          }
        }
      }
      .modal-card-foot {
        .is-left {
          margin-right: auto;
        }
        .checkbox {
          font-size: $size-small;
          margin-right: 1rem;
        }
      }
      @media screen and (max-width: 768px) {
        .modal-card-body {
          padding-left: 0;
          padding-right: 0;

          .columns .main-column {
            margin-bottom: 1rem;
            padding: 0 2.75rem !important;

            > .dropdown,
            > .tabs,
            > .media {
              margin-left: -1.5rem;
              margin-right: -1.5rem;
            }
          }
          .buttons .button {
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>
