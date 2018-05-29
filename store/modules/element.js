import {baseActions} from './base'

export const state = () => ({
  endpoint: '/elements'
})

export const mutations = {
  init(state, params = {themeId: '', itemId: ''}) {
    state.endpoint = `/themes/${params.themeId}/items/${params.itemId}/elements`
  }
}

export const actions = {
  ...baseActions
}
