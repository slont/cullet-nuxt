export const state = () => ({
  endpoint: ''
})

export const actions = {
  signup({state}, params = {data: {}}) {
    return this.$axios({
      url: `/signup`,
      method: 'POST',
      data: params.data
    })
  },

  signin({state}, params = {data: {}}) {
    return this.$axios({
      url: `/signin`,
      method: 'POST',
      data: params.data
    })
  },

  signinTwitter({state}, params = {data: {}}) {
    return this.$axios({
      url: `/signin/twitter`,
      method: 'POST',
      data: params.data,
      redirect: 'manual'
    })
  },

  callback({state}, params = {query: {}}) {
    return this.$axios({
      url: `/callback?${qs.stringify(params.query)}`,
      method: 'GET'
    })
  },

  logout() {
    return this.$axios({
      url: `/logout`,
      method: 'GET'
    })
  },

  signout() {
    return this.$axios({
      url: `/signout`,
      method: 'GET'
    })
  },

  confirm({state}, params = {data: {}}) {
    return this.$axios({
      url: `/confirm`,
      method: 'POST',
      data: params.data,
    })
  }
}
