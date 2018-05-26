import qs from 'qs'
import Base from '../../models/Base'
import {baseState, baseActions, baseMutations} from './base'

export const state = () => ({
  ...baseState
})

export const mutations = {
  ...baseActions
}

export const actions = {
  ...baseMutations,

  findByNew({state}, params = {}) {
    return this.$axios({
      url: `${process.env.API_ENDPOINT}/items/_new?${qs.stringify(params, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    })
  }
}
