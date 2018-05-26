import axios from 'axios'
import qs from 'qs'
import Base from './Base'
import Theme from './Theme'
import Item from './Item'

export default class User extends Base {
  constructor() {
    super(`/users`)
  }

  updatePassword(id, body) {
    return this.postProcess(axios({
      url: `${this.endpoint}/${id}/_password`,
      method: 'put',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      body: JSON.stringify(body)
    }))
  }

  findOneWithReport(id, params = {}) {
    return this.postProcess(axios({
      url: `${this.endpoint}/${id}/_report?${qs.stringify(params, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  findThemes(userId, params = {}) {
    return this.postProcess(axios({
      url: `${this.endpoint}/${userId}/themes?${qs.stringify(params, {indices: false})}`,
      method: 'get',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }), new Theme().deserialize)
  }

  findFavoriteThemes(userId, params = {}) {
    return this.postProcess(axios({
      url: `${this.endpoint}/${userId}/themes/_favorite?${qs.stringify(params, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }), new Theme().deserialize)
  }

  findItems(userId, params = {}) {
    return this.postProcess(axios({
      url: `${this.endpoint}/${userId}/items?${qs.stringify(params, {indices: false})}`,
      method: 'get',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }), new Item().deserialize)
  }

  deserialize(json) {
    if (json instanceof Array) {
      return json.map(v => User._deserialize(v))
    } else {
      return User._deserialize(json)
    }
  }

  static _deserialize(json) {
    return Object.assign({}, json, {
      loggedAt: json.loggedAt | ''
    })
  }
}
