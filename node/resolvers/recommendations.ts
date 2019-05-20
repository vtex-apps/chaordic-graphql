import { ImpressionParams, ProductRecommendationParams, RecommendationParams } from '../clients/recommendation'

export const queries = {
  chaordicProductPageRecommendations: async (_: any, args: ProductRecommendationParams, ctx: Context) => {
    const {clients: {recommendation}} = ctx

    const {
      chaordicBrowserId,
      productId,
      type,
      size,
    } = args

    const params = {
      deviceId: chaordicBrowserId,
      productFormat: 'complete',
      productId,
      size: size || 10,
      type: type || 'BestSellers',
    }

    ctx.set('cache-control', 'no-cache')

    return recommendation.productRecommendations(params)
  },

  chaordicRecommendations: async (_: any, args: RecommendationParams, ctx: Context) => {
    const {clients: {recommendation}} = ctx
    const forwardedHost = ctx.get('x-forwarded-host')

    const {
      chaordicBrowserId,
      pathName,
      source,
      name,
      productId,
    } = args

    const params = {
      deviceId: chaordicBrowserId,
      name: name || 'other',
      productFormat: 'complete',
      productId,
      source,
      url: `https://${forwardedHost}` + pathName,
    }

    ctx.set('cache-control', 'no-cache')

    return recommendation.recommendations(params)
  },
}

export const mutations = {
  ChaordicImpression: async (_: any, args: ImpressionParams, ctx: Context) => {
    const {clients: {recommendation}} = ctx

    return recommendation.impression(args.impressionUrl)
      .then(() => true)
      .catch(() => false)
  },
}
