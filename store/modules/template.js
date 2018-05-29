import {baseActions} from './base'

export const state = () => ({
  endpoint: '/templates'
})

export const mutations = {
  init(state, params = {themeId: ''}) {
    state.endpoint = `/themes/${params.themeId}/templates`
  }
}

export const actions = {
  ...baseActions
}
