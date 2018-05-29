<template>
  <div id="signin">
    <div class="box">
      <div class="title has-text-centered">
        <img class="cullet-logo" src="/img/cullet-logo_orange.png" alt="Colette">
      </div>
      <div class="has-text-centered" v-if="$route.query.redirect">
        {{ $t('views.signin.redirectMessage') }}
      </div>

      <div class="field">
        <guard-button :click="signinTwitter" class="is-info fullwidth" :class="{ 'is-loading': isLoading }">
          <span class="icon"><i class="fab fa-twitter fa-fw"></i></span>
          <span>Twitterでログイン</span>
        </guard-button>
      </div>

      <div class="field-email field">
        <label class="label">{{ $t('views.signin.email') }}</label>
        <div class="control is-expanded has-icons-left">
          <input v-model="email" name="email" class="input" :class="{ 'is-danger': errors.has('email') }"
                 placeholder="some@sample.com" type="text" v-validate="'required|email'">
          <span class="icon is-left"><i class="far fa-envelope"></i></span>
          <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
        </div>
      </div>

      <div class="field-password field">
        <label class="label">{{ $t('views.signin.password') }}</label>
        <div class="control is-expanded has-icons-left">
          <input v-model="password" name="password" class="input" :class="{ 'is-danger': errors.has('password') }"
                 placeholder="password" type="password" v-validate="'required|min:6'">
          <span class="icon is-left"><i class="fas fa-lock"></i></span>
          <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
        </div>
      </div>

      <div class="field-saved-info field">
        <input v-model="checkedSaveLoginInfo" class="is-checkradio is-primary" id="saveInfo" type="checkbox"
               :checked="checkedSaveLoginInfo" :class="{ 'has-background-color': checkedSaveLoginInfo }">
        <label for="saveInfo">ログイン情報を保存</label>
      </div>

      <div class="field">
        <guard-button :click="ok" class="is-primary is-size-5 fullwidth" :class="{ 'is-loading': isLoading }">
          <span>{{ $t('buttons.signin') }}</span>
        </guard-button>
      </div>

      <!--<div class="has-text-centered">-->
        <!--<a @click="ok" class="button is-info">-->
          <!--Twitterでログイン-->
        <!--</a>-->
      <!--</div>-->

      <!--<div class="has-text-centered">-->
        <!--<a @click="ok" class="button is-info">-->
          <!--Facebookでログイン-->
        <!--</a>-->
      <!--</div>-->

      <div class="has-text-centered">
        <nuxt-link to="/signup" class="is-small">
          新規登録はこちらから
        </nuxt-link>
      </div>

      <div v-if="errorMessage" class="help is-danger">{{ errorMessage }}</div>
      <!--<router-link to="/">{{ $t('views.signin.passwordReset') }}</router-link>-->
    </div>
    <!--<div class="field">-->
      <!--<p class="control select">-->
        <!--<select v-model="locale" @change="switchLocale">-->
          <!--<option value="ja">{{ $t('locales.ja') }}</option>-->
          <!--<option value="en">{{ $t('locales.en') }}</option>-->
        <!--</select>-->
      <!--</p>-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    layout: 'blank',
    data() {
      return {
        locale: this.$store.state.locale,
        email: this.$store.state.loginInfo.email || '',
        password: this.$store.state.loginInfo.password || '',
        checkedSaveLoginInfo: !!this.$store.state.loginInfo.email,
        isLoading: false,
        errorMessage: ''
      }
    },
    methods: {
      async ok() {
        await this.$validator.validateAll().then(async result => {
          if (!result) return

          this.isLoading = true
          const loginInfo = {
            email: this.email,
            password: this.password
          }
          await this.$store.dispatch('modules/auth/signin', {data: loginInfo}).then(res => {
            this.$store.dispatch('signin', res.data)
          }).catch(err => {
            this.errorMessage = err.message
            this.isLoading = false
          })
          if (this.checkedSaveLoginInfo) {
            this.$store.dispatch('setLoginInfo', loginInfo)
          } else {
            this.$store.dispatch('setLoginInfo', {})
          }

          this.isLoading = false
          this.$router.push(this.$route.query.redirect || '/')
        }).catch(() => {
          console.log('Correct them errors!')
        })
      },
      signinTwitter() {
        this.$store.dispatch('modules/auth/signinTwitter').then(res => {
          this.$store.dispatch('signin', res.data)
          this.$router.push('/')
        })
      },
      logout() {
        this.$store.dispatch('modules/auth/logout').then(res => {
          console.log(res)
        })
      },
      switchLocale() {
        this.$store.dispatch('setLocale', this.locale)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #signin {
    width: 100%;

    .title {
      text-align: center;

      .cullet-logo {
        height: 64px;
      }
    }
    .box {
      max-width: 400px;
      margin: 3em auto;

      ul {
        margin-bottom: 1em;
      }
    }
  }
</style>
