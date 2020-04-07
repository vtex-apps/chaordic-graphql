import { ExternalClient, InstanceOptions, IOContext, RequestConfig } from '@vtex/api'

export interface RecommendationParams {
  chaordicBrowserId?: string
  deviceId?: string
  name: string
  pathName?: string
  productId: string
  productFormat?: string
  source: string
}

export interface ProductRecommendationParams {
  chaordicBrowserId?: string
  deviceId?: string
  productId: string,
  size: number
  type: string,
}

export interface ImpressionParams {
  impressionUrl: string
}

export default class Recommendation extends ExternalClient {
  public apiKey?: string
  public secretKey?: string

  constructor(context: IOContext, options?: InstanceOptions) {
    super('http://recs.chaordicsystems.com/v0', context, {
      ...options,
      headers: {
        'Accept':'application/json',
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

  public recommendations (params: RecommendationParams): Promise<any> {
    return this.get(this.routes.recommendations, { metric: 'chaordic-recommendations', params })
  }

  public productRecommendations (params: ProductRecommendationParams): Promise<any> {
    return this.get(this.routes.recommendations, { metric: 'chaordic-recommendations-product', params })
  }

  public impression (impressionUrl: string): Promise<any> {
    return this.get(impressionUrl, { metric: 'chaordic-recommendations-impression' })
  }

  private get routes () {
    return {
      recommendations: '/pages/recommendations/',
    }
  }

  private get (url: string, config?: RequestConfig) {
    const params = {
      ...config && config.params,
      apiKey: this.apiKey,
      secretKey: this.secretKey,
    }

    return this.http.get(url, {
      ...config,
      params,
    })
  }
}
