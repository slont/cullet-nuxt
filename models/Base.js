// import axios from '@/plugins/axios'
import axios from 'axios'
import qs from 'qs'

export default class Base {
  constructor(endpoint, state = {}) {
    this.endpoint = `${process.env.API_ENDPOINT}${endpoint}`
    this.state = state
  }

  find(params = {}) {
    return this.postProcess(axios({
      url: `${this.endpoint}?${qs.stringify(params, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  findOne(id, params = {}) {
    return this.postProcess(axios({
      url: `${this.endpoint}/${id}?${qs.stringify(params, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  create(body) {
    return this.postProcess(axios({
      url: `${this.endpoint}`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      data: body
    }))
  }

  update(id, body) {
    return this.postProcess(axios.put({
      url: `${this.endpoint}/${id}`,
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      data: body
    }))
  }

  delete(id) {
    return this.postProcess(axios.delete({
      url: `${this.endpoint}/${id}`,
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  postProcess(promise, deserializer) {
    return promise.then(response => {
      if ('opaqueredirect' === response.type) {
        location.href = response.url
        return Promise.resolve()
      }
      switch (response.status) {
        case 204: // No-Content
          return Promise.resolve()
        default:
          return {
            data: deserializer ? deserializer(response.data) : this.deserialize(response.data),
            headers: response.headers
          }
      }
    }, error => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`)
      return Promise.reject({
        data: error.response.data,
        status: error.response.status
      })
    })
  }

  static getHeaders() {
    return {
      'X-Requested-With': process.browser ? location.href : '', // for CSRF Filter,
      'Content-Type': 'application/json',
      // 'Authorization': localStorage.authToken
    }
  }

  deserialize(json) {
    return json
  }
}
