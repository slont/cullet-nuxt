import axios from 'axios'
import qs from 'qs'
import Base from './Base'
import Item from './Item'
import Template from './Template'

export default class Theme extends Base {
  constructor() {
    super('/themes')
  }

  findByTagName(params = {}) {
    return this.postProcess(axios({
      url: `${this.endpoint}/_tag?${qs.stringify(params, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  findByNew(params = {}) {
    return this.postProcess(axios({
      url: `${this.endpoint}/_new?${qs.stringify(params, {indices: false})}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  findOneFavorite(themeId, userId) {
    return this.postProcess(axios({
      url: `${this.endpoint}/${themeId}/favorites/${userId}`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  updateFavorite(themeId, userId) {
    return this.postProcess(axios({
      url: `${this.endpoint}/${themeId}/favorites/${userId}`,
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  deleteFavorite(themeId, userId) {
    return this.postProcess(axios({
      url: `${this.endpoint}/${themeId}/favorites/${userId}`,
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  deserialize(json) {
    if (json instanceof Array) {
      return json.map(v => Theme._deserialize(v))
    } else {
      return Theme._deserialize(json)
    }
  }

  static _deserialize(json) {
    return Object.assign({}, json, {
      items: (json.items || []).map(item => Item._deserialize(item)),
      templates: (json.templates || []).map(template => Template._deserialize(template)),
      private: 0 !== json.private
    })
  }
}
