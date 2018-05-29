import qs from 'qs'
import {baseActions} from './base'

export const state = () => ({
  endpoint: '/users'
})

export const actions = {
  ...baseActions,

  async updatePassword({state}, params = {id: '', data: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}/_password`,
      method: 'PUT',
      data: params.data
    })
  },

  async findOneWithReport({state}, params = {id: '', query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}/_report?${(qs.stringify(params.query, {indices: false}))}`,
      method: 'GET'
    })
  },

  async findThemes({state}, params = {id: '', query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}/themes?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET'
    })
  },

  async findFavoriteThemes({state}, params = {id: '', query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}/themes/_favorite?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET'
    })
  },

  async findItems({state}, params = {id: '', query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}/items?${qs.stringify(params, {indices: false})}`,
      method: 'GET'
    })
  }
}
