import {
  ImpressionParams,
  ProductRecommendationParams,
  RecommendationParams
} from "../clients/recommendation";

export function atob(b64Encoded?: string) {
  if (!b64Encoded) {
    return "";
  }
  return Buffer.from(b64Encoded, "base64").toString();
}

export const formatSalesChannel = (segment?: any): string[] => {
  if (!segment) {
    return [];
  }

  const franchise = segment.regionId
    ? `${atob(segment.regionId).replace("SW#", "")}-`
    : "";
  return [`${franchise}${segment.channel}`, `marketplace-${segment.channel}`];
};

export const queries = {
  chaordicProductPageRecommendations: async (
    _: any,
    args: ProductRecommendationParams,
    ctx: Context
  ) => {
    const {
      clients: { recommendation }
    } = ctx;

    const { chaordicBrowserId, productId, type, size } = args;

    const params = {
      deviceId: chaordicBrowserId,
      productFormat: "complete",
      productId,
      salesChannel: formatSalesChannel(JSON.parse(atob(ctx.vtex.segmentToken))),
      size: size || 10,
      type: type || "BestSellers"
    };

    ctx.set("cache-control", "no-cache");

    return recommendation.productRecommendations(params);
  },

  chaordicRecommendations: async (
    _: any,
    args: RecommendationParams,
    ctx: Context
  ) => {
    const {
      clients: { recommendation }
    } = ctx;
    const forwardedHost = ctx.get("x-forwarded-host");

    const {
      chaordicBrowserId,
      pathName,
      source,
      category,
      name,
      userId,
      productId,
      showOnlyAvailable
    } = args;

    const params = {
      category,
      deviceId: chaordicBrowserId,
      name: name || "other",
      productFormat: "complete",
      productId,
      salesChannel: formatSalesChannel(JSON.parse(atob(ctx.vtex.segmentToken))),
      showOnlyAvailable,
      source,
      url: `https://${forwardedHost}${pathName}`,
      userId
    };

    ctx.set("cache-control", "no-cache");

    return recommendation.recommendations(params);
  }
};

export const mutations = {
  ChaordicImpression: async (_: any, args: ImpressionParams, ctx: Context) => {
    const {
      clients: { recommendation }
    } = ctx;

    return recommendation
      .impression(args.impressionUrl)
      .then(() => true)
      .catch(() => false);
  }
};
