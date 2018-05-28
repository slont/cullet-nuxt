import qs from 'qs'
import {baseActions, baseMutations} from './base'

export const state = () => ({
  endpoint: `${process.env.API_ENDPOINT}/items`
})

export const mutations = {
  init(state, params = {themeId: ''}) {
    baseMutations.init(state, `/themes/${params.themeId}/items`)
  }
}

export const actions = {
  ...baseActions,

  findByNew({state}, params = {query: {}}) {
    return this.$axios({
      url: `${process.env.API_ENDPOINT}/items/_new?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET'
    })
  }
}
