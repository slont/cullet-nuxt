export default function ({app}) {
  // if (process.server) {
  //   // SPAモードなのでこの条件に来ることはないけどお作法として。
  //   return;
  // }

  app.$axios.interceptors.request.use(config => {
    if (app.store.state.accessToken) {
      config.headers.Authorization = app.store.state.accessToken
    }
    if (process.client) {
      config.headers['X-Requested-With'] = location.href
    }
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  })

  app.$axios.interceptors.response.use(response => response, error => {
    console.log(`There has been a problem with your fetch operation: ${error.message}`)
    if (error.statusCode === 401) {
      app.store.dispatch('signout')
    }
    return Promise.reject(error.response)
  })
}
