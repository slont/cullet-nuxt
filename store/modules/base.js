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
    })
  },

  async findOne({state}, params = {id: '', query: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}?${qs.stringify(params.query, {indices: false})}`,
      method: 'GET',
    })
  },

  async create({state}, params = {data: {}}) {
    return this.$axios({
      url: `${state.endpoint}`,
      method: 'POST',
      data
    })
  },

  async update({state}, params = {id: '', data: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}`,
      method: 'PUT',
      data
    })
  },

  async delete({state}, params = {id: '', data: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}`,
      method: 'DELETE'
    })
  }
}
