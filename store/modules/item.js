import qs from 'qs'
import {baseActions} from './base'

export const state = () => ({
  endpoint: '/items'
})

export const mutations = {
  init(state, params = {themeId: ''}) {
    state.endpoint = `/themes/${params.themeId}/items`
  }
}

export const actions = {
  ...baseActions,

  async findByNew({state}, params = {query: {}}) {
    return this.$axios({
      url: `/items/_new?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET'
    })
  }
}
