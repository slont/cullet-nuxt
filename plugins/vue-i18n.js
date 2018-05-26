import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@/locales'

Vue.use(VueI18n)

export default ({app}) => {
  app.i18n = new VueI18n({
    locale: 'ja',
    messages
  })
}
