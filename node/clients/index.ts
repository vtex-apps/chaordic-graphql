import { IOClients } from '@vtex/api'

import Recommendation from './recommendation'
import Search from './search'

export class Clients extends IOClients {
  get recommendation() {
    return this.getOrSet('recommendation', Recommendation)
  }

  get search() {
    return this.getOrSet('search', Search)
  }
}
