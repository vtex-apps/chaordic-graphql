import { ResolverWarning } from '@vtex/api'
import { prop, sortBy } from 'ramda'

import {
  AutocompleteParams,
  SearchParams,
  NavigatesParams,
} from '../clients/search'
import { utf8ToChar } from '../utf8'
import { formatSalesChannel, atob } from '../utils'

export const queries = {
  searchProducts: async (_: any, args: SearchParams, ctx: Context) => {
    const {
      clients: { search },
    } = ctx

    return search.search({
      ...args,
      salesChannel:
        args.salesChannel ??
        formatSalesChannel(JSON.parse(atob(ctx.vtex.segmentToken))),
    })
  },

  searchProductsAutoComplete: async (
    _: any,
    args: AutocompleteParams,
    ctx: Context
  ) => {
    const {
      clients: { search },
    } = ctx
    return search.autocomplete({
      ...args,
      salesChannel: formatSalesChannel(JSON.parse(atob(ctx.vtex.segmentToken))),
    })
  },

  searchProductsAutoCompletePopular: async (_: any, __: any, ctx: Context) => {
    const {
      clients: { search },
    } = ctx
    return search.popular()
  },

  searchProductsNavigates: async (
    _: any,
    args: NavigatesParams,
    ctx: Context
  ) => {
    const {
      clients: { search },
    } = ctx

    const { fields, category, multicategory } = args

    if (fields && (category || multicategory?.length)) {
      throw new Error(
        'The field "fields" cannot be used together with the category or multicategory field'
      )
      /*
       * read more about this rule in the documentation: https://docs.linximpulse.com/v3-search/docs/navigate
       */
    }

    if (category && multicategory?.length) {
      throw new Error(
        'The category and multicategory fields cannot be used together'
      )
      /*
       * read more about this rule in the documentation: https://docs.linximpulse.com/v3-search/docs/navigate
       */
    }

    return search.navigates(args)
  },
}

export const rootResolvers = {
  ChaordicSearchFilters: {
    values: ({ values }: any) => values && sortBy(prop('id') as any, values),
  },
  ChaordicSearchProduct: {
    cacheId: ({ id, name }: any) => `${id} - ${name}`,
    productId: ({ id }: any) => id,
  },
  ChaordicSearchProductDetails: {
    clusterHighlights: ({ clusterHighlights }: any) => {
      let clusterHighlightsFormatted = []
      try {
        clusterHighlightsFormatted = clusterHighlights.map(
          (clusterHighlight: string) => {
            let clusterHighlightDecoded = clusterHighlight

            Object.keys(utf8ToChar).forEach((key: string) => {
              clusterHighlightDecoded = clusterHighlightDecoded.replace(
                new RegExp(key, 'g'),
                utf8ToChar[key]
              )
            })

            return {
              name: Object.values(
                JSON.parse(clusterHighlightDecoded.replace(/'/g, '"'))
              )[0],
            }
          }
        )
      } catch (e) {
        throw new ResolverWarning(e)
      }

      return clusterHighlightsFormatted
    },
  },
}
