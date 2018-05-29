import qs from 'qs'

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
      data: params.data
    })
  },

  async update({state}, params = {id: '', data: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}`,
      method: 'PUT',
      data: params.data
    })
  },

  async delete({state}, params = {id: '', data: {}}) {
    return this.$axios({
      url: `${state.endpoint}/${params.id}`,
      method: 'DELETE'
    })
  }
}
