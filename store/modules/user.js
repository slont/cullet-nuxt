import qs from 'qs'
import {baseActions, baseMutations} from './base'

export const state = () => ({
  endpoint: `${process.env.API_ENDPOINT}/users`
})

export const actions = {
  ...baseActions,

  updatePassword({state}, params = {id: '', data: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}/_password`,
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      data
    })
  },

  findOneWithReport({state}, params = {id: '', query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}/_report?${(qs.stringify(params.query, {indices: false}))}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
  },

  findThemes({state}, params = {id: '', query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}/themes?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
  },

  findFavoriteThemes({state}, params = {id: '', query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}/themes/_favorite?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
  },

  findItems({state}, params = {id: '', query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}/items?${qs.stringify(params, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
  }
}
