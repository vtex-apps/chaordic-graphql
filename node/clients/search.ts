import {
  ExternalClient,
  InstanceOptions,
  IOContext,
  RequestConfig,
} from '@vtex/api'
import { stringify } from 'qs'

export interface SearchParams {
  filter: string
  page: number
  resultsPerPage: number
  sortBy: string
  terms: string
  salesChannel?: string
}

export interface AutocompleteParams {
  terms: string
  salesChannel?: string
}

export interface NavigatesParams {
  resultsPerPage: number
  sortBy: string
  filter: string
  page: number
  productFormat: string
  fields: string
  category: string
  multicategory: string[]
}

export interface HotsitesParams {
  filter: string
  page: number
  resultsPerPage: number
  sortBy: string
  name: string
}

const treatedStatusCodes = [404, 302]
const treatedErrors = (e: any) => {
  if (
    e.response &&
    e.response.status &&
    treatedStatusCodes.includes(e.response.status)
  ) {
    return e.response.data
  }
  throw e
}

export default class Search extends ExternalClient {
  public apiKey?: string
  public secretKey?: string

  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://api.linximpulse.com/engage/search/v3`, context, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  // This is initialized by the withSecretKeys directive
  public init(secretKeys: SecretKeys) {
    this.apiKey = secretKeys?.apiKey
    this.secretKey = decodeURIComponent(secretKeys?.secretKey)
  }

  public search(params: SearchParams): Promise<any> {
    return this.get(this.routes.search, { metric: 'chaordic-search', params })
  }

  public autocomplete(params: AutocompleteParams): Promise<any> {
    return this.get(this.routes.autocomplete, {
      metric: 'chaordic-autocomplete',
      params,
    })
  }

  public popular(): Promise<any> {
    return this.get(this.routes.popular, { metric: 'chaordic-popular' })
  }

  public navigates(params: NavigatesParams): Promise<any> {
    return this.get(this.routes.navigates, {
      metric: 'chaordic-navigates',
      params,
    })
  }

  public hotsites(params: HotsitesParams): Promise<any> {
    return this.get(this.routes.hotsites, {
      metric: 'chaordic-hotsites',
      params,
    })
  }

  private get routes() {
    return {
      autocomplete: '/autocompletes',
      popular: '/autocompletes/popular',
      search: '/search',
      navigates: '/navigates',
      hotsites: '/hotsites',
    }
  }

  private get(url: string, config?: RequestConfig) {
    const params = {
      ...config?.params,
      apiKey: this.apiKey,
      secretKey: this.secretKey,
    }

    return this.http
      .get(url, {
        ...config,
        params,
        paramsSerializer: oldParams =>
          stringify(oldParams, { arrayFormat: 'repeat' }),
      })
      .catch(treatedErrors)
  }
}
