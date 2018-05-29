<template>
  <div id="settings-password">
    <nuxt-link to="/settings" class="label">/設定</nuxt-link>

    <div class="field">
      <label class="label">現在のパスワード</label>
      <div class="control">
        <input v-model.trim="password" class="input" type="password"
               name="password" v-validate="'required|max:60|regex:^([\\w-]+)$'">
        <span v-show="errors.has('password')" class="has-text-danger">{{ errors.first('password') }}</span>
      </div>
    </div>

    <div class="field">
      <label class="label">新しいパスワード（半角英数字、記号[-_@#$%^&*+!?]）</label>
      <div class="control">
        <input v-model.trim="newPassword" class="input" type="password"
               name="newPassword" v-validate="'required|max:60|regex:^([\\w-@#\\$%\\^&\\*\\+\\!\\?]+)$'">
        <span v-show="errors.has('newPassword')" class="has-text-danger">{{ errors.first('newPassword') }}</span>
      </div>
    </div>

    <div class="save-button has-right">
      <guard-button :click="save" class="button is-info">変更</guard-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        password: '',
        newPassword: ''
      }
    },
    created() {
      this.user = Object.assign({}, this.$store.state.user)
    },
    methods: {
      save() {
        this.$validator.validateAll().then(result => {
          if (!result) return
          this.$store.dispatch('modules/user/updatePassword', {
            id: this.$store.state.user.id,
            data: {
              password: this.password,
              newPassword: this.newPassword
            }
          }).then(res => {
            this.$message({
              showClose: true,
              message: '変更されました',
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
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #settings-password {
    padding: 1rem;
  }
</style>
