import qs from 'qs'
import {baseState, baseActions, baseMutations} from './base'

export const state = () => ({
  ...baseState
})

export const mutations = {
  ...baseActions
}

export const actions = {
  ...baseMutations,

  findByNew({state}, params = {query: {}}) {
    return this.$axios({
      url: `${process.env.API_ENDPOINT}/items/_new?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
  }
}
