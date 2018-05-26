import axios from 'axios'
import Base from './Base'

export default class File extends Base {
  constructor() {
    super('/files')
  }

  create(file, fileName, themeId) {
    const formData = new FormData()
    formData.append('file', file, fileName)
    if (themeId) {
      formData.append('themeId', themeId)
    }
    return this.postProcess(axios({
      url: `${this.endpoint}`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: Object.assign({
        'Authorization': localStorage.authToken
      }, Base.getHeaders()),
      body: formData
    }))
  }

  deserialize(json) {
    const result = Object.assign({}, json)
    return result
  }
}
