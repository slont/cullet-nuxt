<template>
  <div id="settings-profile">
    <nuxt-link to="/settings" class="label">/設定</nuxt-link>

    <div class="columns">
      <div class="column is-8">
        <div class="field">
          <label class="label">ユーザーID（半角英数字、記号[-_]）</label>
          <div class="control">
            <input v-model.trim="user.id" class="input" type="text"
                   name="userId" v-validate="'required|max:32|regex:^([\\w-]+)$'">
            <span v-show="errors.has('userId')" class="has-text-danger">{{ errors.first('userId') }}</span>
          </div>
        </div>

        <div class="field">
          <label class="label">ユーザーネーム</label>
          <div class="control">
            <input v-model.trim="user.name" class="input" type="text"
                   name="userName" v-validate="'required|max:32'">
            <span v-show="errors.has('userName')" class="has-text-danger">{{ errors.first('userName') }}</span>
          </div>
        </div>

        <div class="field">
          <label class="label">メールアドレス</label>
          <div class="control">
            <input v-model.trim="self.email" class="input" type="email"
                   name="email" v-validate="'required|max:255'">
            <span v-show="errors.has('email')" class="has-text-danger">{{ errors.first('email') }}</span>
          </div>
        </div>

        <div class="field">
          <label class="label">自己紹介</label>
          <div class="control">
            <textarea v-model="self.biography" class="textarea" :rows="rows"></textarea>
          </div>
        </div>
      </div>

      <div class="column is-4">
        <div class="field image-field">
          <label class="label">イメージ画像</label>
          <div class="control">
            <div class="file is-boxed">
              <label class="file-label">
                <input @change="changeImage" class="file-input" type="file" name="resume">
                <div class="file-view" v-if="self.image">
                  <img :src="self.image" v-if="loading"/>
                  <user-image :src="self.image" v-else/>
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

        <div class="save-button has-right">
          <guard-button :click="save" class="button is-info" :disabled="loading">保存</guard-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserModel from '@/models/User'

  export default {
    data() {
      return {
        id: '',
        self: {
          id: '',
          name: '',
          email: '',
          biography: '',
          image: ''
        }
      }
    },
    computed: {
      loading() {
        return /^data:.+/.test(this.self.image)
      },
      rows() {
        const num = this.self.biography.split('\n').length
        return (num > 2) ? num : 2
      }
    },
    created() {
      this.id = this.user.id
      this.self = Object.assign({}, this.user)
    },
    methods: {
      save() {
        this.$validator.validateAll().then(result => {
          if (!result) return

          new UserModel().update(this.id, {
            id: this.self.id,
            name: this.self.name,
            email: this.self.email,
            biography: this.self.biography,
            image: this.self.image
          }).then(() => {
            this.$store.commit('SET_USER', this.self)
            this.id = this.self.id
            this.$message({
              showClose: true,
              message: '保存されました',
              type: 'success'
            })
          }).catch(err => {
            console.log(err)
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        })
      },
      changeImage(e) {
        this.createDataUrl(e, (dataUrl, fileName) => {
          this.self.image = dataUrl
          this.$store.dispatch('modules/file/create', {file: this.dataURLtoBlob(dataUrl), fileName}).then(res => {
            this.self.image = res.data.path
          })
        })
      },
      removeImage() {
        this.self.image = ''
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #settings-profile {
    padding: 1rem;

    .delete {
      position: absolute;
      top: 5px;
      right: 5px;
      z-index: 10;
    }
  }
</style>
