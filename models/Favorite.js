import Base from './Base'

export default class Favorite extends Base {
  constructor() {
    super('/favorites')
  }

  deserialize(json) {
    if (json instanceof Array) {
      return json.map(v => Favorite._deserialize(v))
    } else {
      return Favorite._deserialize(json)
    }
  }

  static _deserialize(json) {
    if (!json) {
      return {}
    }

    return Object.assign({}, json)
  }
}
