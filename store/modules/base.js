import qs from 'qs'
import Base from "../../models/Base";

export const baseState = {
  endpoint: ''
}

export const baseMutations = {
  init(state, path) {
    state.endpoint = `${process.env.API_ENDPOINT}${path}`
  }
}

export const baseActions = {
  async find({state}, params = {query: {}}) {
    return this.$axios({
      url: `${state.endpoint}?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    })
  },

  async findOne({state}, params = {id: '', query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    })
  },

  async create({state}, params = {data: {}}) {
    return this.$axios({
      url: `${state.endpoint}`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      data
    })
  },

  async update({state}, params = {id: '', data: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}`,
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      data
    })
  },

  async delete({state}, params = {id: '', data: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}`,
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    })
  }
}
