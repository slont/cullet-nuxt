<template>
  <div id="signup">
    <div class="box">
      <template v-if="0 === pageIndex">
        <div class="title has-text-centered">{{ $t('title') }}</div>
        <div class="field-email field">
            <label class="label">{{ $t('views.signup.email') }}</label>
          <div class="control is-expanded has-icons-left">
            <input v-model="email" name="email" class="input" :class="{ 'is-danger': errors.has('email') }"
                   placeholder="some@sample.com" type="text" v-validate="'required|email'">
            <span class="icon is-small is-left"><i class="material-icons">email</i></span>
            <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
          </div>
        </div>

        <div class="field-password field">
          <label class="label">{{ $t('views.signup.password') }}</label>
          <div class="control is-expanded has-icons-left">
            <input v-model="password" name="password" class="input" :class="{ 'is-danger': errors.has('password') }"
                   placeholder="password" type="password" v-validate="'required|min:6'">
            <span class="icon is-small is-left"><i class="material-icons">vpn_key</i></span>
            <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
          </div>
        </div>

        <div class="has-text-centered">
          <guard-button :click="ok" class="is-info" :class="{ 'is-loading': isLoading }">
            {{ $t('buttons.signup') }}
          </guard-button>
        </div>
        <div v-if="errorMessage" class="help is-danger">{{ errorMessage }}</div>

        <div class="has-text-centered">
          <nuxt-link to="/signin" class="label">
            ログインはこちらから
          </nuxt-link>
        </div>
      </template>

      <template v-else-if="1 === pageIndex">
        <div>確認メールを送信しました</div>
        <nuxt-link to="/">トップページに戻る</nuxt-link>
      </template>
    </div>
  </div>
</template>

<script>
  import AuthModel from '@/models/Auth'

  export default {
    layout: 'blank',
    data() {
      return {
        pageIndex: 0,
        locale: this.$store.state.locale,
        email: '',
        password: '',
        isLoading: false,
        errorMessage: ''
      }
    },
    computed: {
      teamKey() {
        return this.$store.getters.teamKey
      }
    },
    methods: {
      async ok() {
        await this.$validator.validateAll().then(async result => {
          if (!result) return

          this.isLoading = true
          await new AuthModel().signup({
            email: this.email,
            password: this.password
          }).catch(err => {
            this.isLoading = false
            this.errorMessage = err.message
            throw new Error(err)
          })

          this.isLoading = false
          this.pageIndex = 1
        }).catch(() => {
          console.log('Correct them errors!')
        })
      },
      switchLocale() {
        this.$store.dispatch('setLocale', this.locale)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #signup {
    width: 100%;

    .title {
      text-align: center;
    }
    .box {
      width: 30%;
      min-width: 360px;
      margin: 3em auto;

      .label {
        min-width: 120px;
      }
      ul {
        margin-bottom: 1em;
      }
    }
  }
</style>
