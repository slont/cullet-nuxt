<template>
  <modal id="theme-edit-modal" class="modal" ref="themeEditModal" @close="reset">
    <header class="action-modal-header modal-card-head">
      <span class="back-button icon is-size-3" @click="close">
        <i class="material-icons">arrow_back</i>
      </span>

      <span class="modal-card-title title is-6 has-text-white">テーマ編集</span>

      <guard-button :click="ok" class="ok-button is-success is-inverted is-outlined is-size-5"
                    v-if="!loading">
        保存
      </guard-button>
    </header>

    <div class="modal-card-body columns">
      <div class="column">
        <div class="field">
          <label class="label">タイトル</label>
          <div class="control">
            <input v-model.trim="theme.title" class="input" type="text" placeholder="タイトル"
                   name="title" :class="{ 'is-danger': errors.has('title') }" v-validate="'required|max:255'">
            <span v-show="errors.has('title')" class="help is-danger">{{ errors.first('title') }}</span>
          </div>
        </div>

        <div class="field">
          <label class="label">説明文</label>
          <div class="control">
            <textarea v-model="theme.description" :rows="rows" class="textarea" placeholder="説明文"></textarea>
          </div>
        </div>
      </div>

      <div class="column">
        <div class="field image-field">
          <label class="label">メイン画像（オプショナル）</label>
          <div class="control">
            <div class="file is-boxed">
              <label class="file-label">
                <input @change="changeImage" class="file-input" type="file" name="resume">
                <div class="file-view" v-if="theme.image">
                  <img :src="theme.image" v-if="loading"/>
                  <img :src="theme.image" :srcset="`${theme.image}_640w 640w`" v-else/>
                  <a @click.stop.prevent="removeImage" class="delete"></a>
                </div>
                <div class="file-cta" v-else>
                  <span class="icon is-size-1"><i class="material-icons">add</i></span>
                </div>
                <div class="control loading-mask is-size-1" :class="{ 'is-loading': loading }"></div>
              </label>
            </div>
          </div>
        </div>

        <div class="field tags-field">
          <label class="label">タグ</label>

          <div class="control tags flexbox">
            <el-tag v-for="(tag, i) in tags" :key="tag" type="warning" closable
                    @close="$delete(tags, i)">{{ tag }}</el-tag>
            <input v-model="inputVal" class="input-new-tag input"
                   @keyup.enter="confirmInput" @focus="$emit('focus')" @blur="onBlur"/>
          </div>
        </div>

        <div class="publication-field field">
          <input v-model="publication" class="is-checkradio has-background-color is-info"
                 id="publication" type="checkbox">
          <label class="publication" :class="{ 'is-publication': publication }" for="publication"
                 @click="publication = !publication">一般公開する</label>
        </div>
      </div>
    </div>

    <footer class="modal-card-foot has-right is-hidden-mobile">
      <span class="has-text-danger" v-if="errorMessage">{{ errorMessage }}</span>
      <a @click="$refs.themeDeleteModal.open(theme)" class="button is-danger is-outlined is-left">削除</a>
      <a @click="close" class="button">キャンセル</a>
      <guard-button :click="ok" class="is-info" :disabled="loading">保存</guard-button>
    </footer>

    <theme-delete-modal ref="themeDeleteModal" @refresh="refreshClose"/>
  </modal>
</template>

<script>
  import Modal from '@/components/Modal'
  import ThemeDeleteModal from './ThemeDeleteModal'

  export default {
    components: { Modal, ThemeDeleteModal },
    data() {
      return {
        theme: {
          title: '',
          description: '',
          image: '',
          private: 0,
          tags: [],
          createdUser: this.$store.state.user
        },
        tags: [],
        publication: false,
        inputVal: '',
        errorMessage: '',
        suggests: []
      }
    },
    computed: {
      loading() {
        return /^data:.+/.test(this.theme.image)
      },
      rows() {
        const num = this.theme.description.split('\n').length
        return (num > 2) ? num : 2
      }
    },
    methods: {
      open(theme) {
        Object.assign(this.theme, theme)
        this.tags = theme.tags.map(tag => tag.name)
        this.publication = !theme.private
        this.$refs.themeEditModal.open()
      },
      close() {
        this.reset()
        this.$refs.themeEditModal.close()
      },
      async ok() {
        await this.$validator.validateAll().then(async result => {
          if (!result) return

          const body = {
            title: this.theme.title,
            description: this.theme.description,
            image: this.theme.image,
            tags: this.tags,
            private: this.publication ? 0 : 2
          }
          await this.$store.dispatch('modules/theme/update', {id: this.theme.id, data: body}).catch(err => {
            this.errorMessage = err
            throw new Error(err)
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
      remoteMethod(query) {
        if ('' !== query) {
          this.suggests = [
              query,
              query.substring(0, 1).toUpperCase() + query.substring(1),
              query.toUpperCase()
          ]
        } else {
          this.suggests = []
        }
      },
      changeImage(e) {
        this.createDataUrl(e, (dataUrl, fileName) => {
          this.theme.image = dataUrl
          this.$store.dispatch('modules/file/create', {file: this.dataURLtoBlob(dataUrl), fileName}).then(res => {
            this.theme.image = res.data.path
          })
        })
      },
      removeImage() {
        this.theme.image = ''
      },
      confirmInput() {
        const inputVal = this.inputVal
        if (inputVal && -1 === this.tags.indexOf(inputVal)) {
          this.tags.push(inputVal)
        }
        this.inputVal = ''
      },
      onBlur() {
        this.confirmInput()
        this.$emit('blur')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #theme-edit-modal {
    > .modal-card {
      .modal-card-body {
        margin-bottom: 0;

        .image-field {
          .file-view {
            .delete {
              position: absolute;
              top: 5px;
              right: 5px;
              z-index: 10;
            }
          }
        }
        .tags-field {
          .control {
            flex-wrap: wrap;
            margin-bottom: 0;

            .input-new-tag {
              width: auto;
            }
          }
        }
        .publication-field {
          .publication:before {
            border: 2px solid $info !important;
          }
          .publication:not(.is-publication):before {
            background-color: white !important;
            border: 2px solid darkgrey !important;
          }
        }
      }
      .modal-card-foot {
        .is-left {
          margin-right: auto;
        }
      }
    }
  }
</style>
