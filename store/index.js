import Vuex from 'vuex'
import { LOCALES } from '~/constant'
import { SET_USER, SET_ACCESS_TOKEN, SET_LOCALE, SET_LOGGED_IN, SET_LOGIN_INFO, SET_ITEMS, SET_THEME, SET_THEMES, SET_TEMPLATES, SET_HEADER_ACTIVE, SET_FOOTER_ACTIVE } from './mutation-types'
export const state = () => ({
  locale: LOCALES.JA,
  accessToken: '',
  user: {},
  loggedIn: false,
  loginInfo: {},
  items: [],
  theme: {
    templates: []
  },
  themes: [],
  activeHeader: true,
  activeFooter: true
})

export const mutations = {
  [SET_LOCALE](state, locale) {
    state.locale = locale
  },
  [SET_USER](state, user) {
    state.user = user
  },
  [SET_ACCESS_TOKEN](state, accessToken) {
    state.accessToken = accessToken
  },
  [SET_LOGGED_IN](state, loggedIn) {
    state.loggedIn = loggedIn
  },
  [SET_LOGIN_INFO](state, loginInfo) {
    state.loginInfo = loginInfo
  },
  [SET_THEME](state, theme) {
    state.theme = theme
  },
  [SET_THEMES](state, themes) {
    state.themes = themes
  },
  [SET_TEMPLATES](state, templates) {
    state.theme.templates = templates
  },
  [SET_ITEMS](state, items) {
    state.items = items
  },
  [SET_HEADER_ACTIVE](state, active) {
    state.activeHeader = active
  },
  [SET_FOOTER_ACTIVE](state, active) {
    state.activeFooter = active
  }
}

export const actions = {
  setLocale({ commit }, locale) {
    commit(SET_LOCALE, locale)
  },
  setLoggedIn({commit}, loggedIn) {
    commit(SET_LOGGED_IN, loggedIn)
    if (!loggedIn) {
      commit(SET_USER, {})
      commit(SET_THEME, {})
    }
  },
  setLoginInfo({commit}, loginInfo) {
    commit(SET_LOGIN_INFO, loginInfo)
  },
  signin({ commit }, params) {
    commit(SET_LOGGED_IN, true)
    commit(SET_ACCESS_TOKEN, params.authToken)
    commit(SET_USER, params.user)
  },
  confirm({ commit }, params) {
    commit(SET_LOGGED_IN, true)
    commit(SET_ACCESS_TOKEN, params.authToken)
    commit(SET_USER, params.user)
  },
  signout({ commit }) {
    commit(SET_LOGGED_IN, false)
    commit(SET_ACCESS_TOKEN, '')
    commit(SET_USER, {})
    commit(SET_THEME, {})
  },
  setActiveHeader({ commit }, active) {
    commit(SET_HEADER_ACTIVE, active)
  },
  setActiveFooter({ commit }, active) {
    commit(SET_FOOTER_ACTIVE, active)
  }
}
