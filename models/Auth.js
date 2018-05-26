import axios from 'axios'
import qs from 'qs'
import Base from './Base'
import User from './User'

export default class Auth extends Base {
  constructor() {
    super('')
  }

  signup(body) {
    return this.postProcess(axios({
      url: `${this.endpoint}/signup`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      data: body
    }))
  }

  signin(body) {
    return this.postProcess(axios({
      url: `${this.endpoint}/signin`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      data: body
    }))
  }

  signinTwitter(body) {
    return this.postProcess(axios({
      url: `${this.endpoint}/signin/twitter`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      redirect: 'manual',
      data: body,
    }))
  }

  callback(params = {}) {
    return this.postProcess(axios({
      url: `${this.endpoint}/callback?${qs.stringify(params, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  logout() {
    return this.postProcess(axios({
      url: `${this.endpoint}/logout`,
      method: 'GET',
      headers: Base.getHeaders()
    }))
  }

  signout() {
    return this.postProcess(axios({
      url: `${this.endpoint}/signout`,
      method: 'GET',
      headers: Base.getHeaders()
    }))
  }

  confirm(body) {
    return this.postProcess(axios({
      url: `${this.endpoint}/confirm`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      body: body
    }))
  }

  getToken() {
    return localStorage.authToken
  }

  onChange() {}

  deserialize(json) {
    if (json instanceof Array) {
      return json.map(v => Auth._deserialize(v))
    } else {
      return Auth._deserialize(json)
    }
  }

  static _deserialize(json) {
    return Object.assign({}, json, {
      user: (json.user && new User().deserialize(json.user)) || {}
    })
  }
}
