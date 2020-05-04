import { ResolverWarning } from '@vtex/api'
import { prop, sortBy } from 'ramda'

import { AutocompleteParams, SearchParams } from '../clients/search'
import { utf8ToChar } from '../utf8'

export const queries = {
  searchProducts: async (_: any, args: SearchParams, ctx: Context) => {
    const {clients: {search}} = ctx
    const data = await search.search(args)
    console.log(data)
    return data
  },

  searchProductsAutoComplete: async (_: any, args: AutocompleteParams, ctx: Context) => {
    const {clients: {search}} = ctx
    return search.autocomplete(args)
  },

  searchProductsAutoCompletePopular: async (_: any, __: any, ctx: Context) => {
    const {clients: {search}} = ctx
    return search.popular()
  },
}

export const rootResolvers = {
  ChaordicSearchFilters: {
    values: ({values}: any) => values && sortBy(prop('id') as any, values),
  },
  ChaordicSearchProduct: {
    cacheId: ({id, name}: any) => `${id} - ${name}`,
    productId: ({id}: any) => id,
  },
  ChaordicSearchProductDetails: {
    clusterHighlights: ({clusterHighlights}: any) => {
      let clusterHighlightsFormatted = []
      try {
        clusterHighlightsFormatted = clusterHighlights.map((clusterHighlight: string) => {
          let clusterHighlightDecoded = clusterHighlight

          Object.keys(utf8ToChar).forEach((key: string) => {
            clusterHighlightDecoded = clusterHighlightDecoded.replace(new RegExp(key, 'g'), utf8ToChar[key])
          })

          return {
            'name': Object.values( JSON.parse(clusterHighlightDecoded.replace(/'/g, '"')) )[0],
          }
        })
      } catch(e) {
        throw new ResolverWarning(e)
      }

      return clusterHighlightsFormatted
    },
  },
}
