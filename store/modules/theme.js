import qs from 'qs'
import {baseState, baseActions, baseMutations} from './base'

export const state = () => ({
  endpoint: `${process.env.API_ENDPOINT}/themes`
})

export const actions = {
  ...baseActions,

  findByTagName({state}, params = {query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/_tag?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET'
    })
  },

  findByNew({state}, params = {query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/_new?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET'
    })
  },

  findOneFavorite({state}, params = {themeId: '', userId: ''}) {
    return this.$axios({
      url:`${state.endpoint}/${params.themeId}/favorites/${params.userId}`,
      method: 'GET'
    })
  },

  updateFavorite({state}, params = {themeId: '', userId: ''}) {
    return this.$axios({
      url: `${state.endpoint}/${params.themeId}/favorites/${params.userId}`,
      method: 'PUT'
    })
  },

  deleteFavorite({state}, params = {themeId: '', userId: ''}) {
    return state.$axios({
      url: `${state.endpoint}/${params.themeId}/favorites/${params.userId}`,
      method: 'DELETE'
    })
  }
}
