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

  findThemes({state}, params = {userId: '', query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.userId}/themes?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
  },

  findFavoriteThemes({state}, params = {userId: '', query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.userId}/themes/_favorite?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
  },

  findItems({state}, params = {userId: '', query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${userId}/items?${qs.stringify(params, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
  }
}
