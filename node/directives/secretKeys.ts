import { defaultFieldResolver, GraphQLField } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

export class WithSecretKeys extends SchemaDirectiveVisitor {
  public visitFieldDefinition (field: GraphQLField<any, any>) {
    const {resolve = defaultFieldResolver} = field
    field.resolve = async (root: any, args: any, ctx: Context, info: any) => {
      const bucket = 'secret_keys'
      const filePath = 'keys.json'
      const secrets = await ctx.clients.vbase.getJSON<SecretKeys>(bucket, filePath)
      ctx.clients.search.init(secrets)
      ctx.clients.recommendation.init(secrets)
      return resolve(root, args, ctx, info)
    }
  }
}
