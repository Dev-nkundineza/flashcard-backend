import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from './graphql/flashCard'
import * as usertypes from './graphql/user'
import * as authTypes from './graphql/Auth'

export const schema = makeSchema({
  types : [usertypes, types, authTypes], 
  outputs: {
    schema: join(process.cwd(), "schema.graphql"), 
    typegen: join(process.cwd(), "nexus-typegen.ts"), 
  },

  contextType: {
    module: join(process.cwd()),
    export: "Context"
  }
})