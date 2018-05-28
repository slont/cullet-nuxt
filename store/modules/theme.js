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
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
  },

  findByNew({state}, params = {query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/_new?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
  },

  findOneFavorite({state}, params = {themeId: '', userId: ''}) {
    return this.$axios({
      url:`${state.endpoint}/${params.themeId}/favorites/${params.userId}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
  },

  updateFavorite({state}, params = {themeId: '', userId: ''}) {
    return this.$axios({
      url: `${state.endpoint}/${params.themeId}/favorites/${params.userId}`,
      method: 'PUT',
      mode: 'cors',
      credentials: 'include'
    })
  },

  deleteFavorite({state}, params = {themeId: '', userId: ''}) {
    return state.$axios({
      url: `${state.endpoint}/${params.themeId}/favorites/${params.userId}`,
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include'
    })
  }
}
