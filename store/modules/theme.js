import qs from 'qs'
import {baseActions} from './base'

export const state = () => ({
  endpoint: '/themes'
})

export const actions = {
  ...baseActions,

  async findByTagName({state}, params = {query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/_tag?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET'
    })
  },

  async findByNew({state}, params = {query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/_new?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET'
    })
  },

  async findOneFavorite({state}, params = {id: '', userId: ''}) {
    return this.$axios({
      url:`${state.endpoint}/${params.id}/favorites/${params.userId}`,
      method: 'GET'
    })
  },

  async updateFavorite({state}, params = {id: '', userId: ''}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}/favorites/${params.userId}`,
      method: 'PUT'
    })
  },

  async deleteFavorite({state}, params = {id: '', userId: ''}) {
    return state.$axios({
      url: `${state.endpoint}/${params.id}/favorites/${params.userId}`,
      method: 'DELETE'
    })
  }
}
