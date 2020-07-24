import {
  ExternalClient,
  InstanceOptions,
  IOContext,
  RequestConfig,
} from '@vtex/api'
import { stringify } from 'qs'

export interface RecommendationParams {
  chaordicBrowserId?: string
  deviceId?: string
  name: string
  salesChannel?: string
  userId?: string
  pathName?: string
  category?: string[]
  productId: string
  productFormat?: string
  source: string
  showOnlyAvailable: boolean
}

export interface ProductRecommendationParams {
  chaordicBrowserId?: string
  deviceId?: string
  salesChannel?: string
  productId: string
  size: number
  type: string
}

export interface ImpressionParams {
  impressionUrl: string
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

export default class Recommendation extends ExternalClient {
  public apiKey?: string
  public secretKey?: string

  constructor(context: IOContext, options?: InstanceOptions) {
    super('http://recs.chaordicsystems.com/v0', context, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-vtex-use-https': 'true',
      },
    })
  }

  // This is initialized by the withSecretKeys directive
  public init(secretKeys: SecretKeys) {
    this.apiKey = secretKeys?.apiKey
    this.secretKey = decodeURIComponent(secretKeys?.secretKey)
  }

  public recommendations(params: RecommendationParams): Promise<any> {
    return this.get(this.routes.recommendations, {
      metric: 'chaordic-recommendations',
      params,
    })
  }

  public productRecommendations(
    params: ProductRecommendationParams
  ): Promise<any> {
    return this.get(this.routes.recommendations, {
      metric: 'chaordic-recommendations-product',
      params,
    })
  }

  public impression(impressionUrl: string): Promise<any> {
    return this.get(impressionUrl, {
      metric: 'chaordic-recommendations-impression',
    })
  }

  private get routes() {
    return {
      recommendations: '/pages/recommendations/',
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
