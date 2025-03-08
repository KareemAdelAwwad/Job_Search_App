import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import {QueryFields} from "./Fields/query.js";
import {MutationFields} from "./Fields/mutation.js";

const mainSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {...QueryFields}
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: {...MutationFields}
  })
});

export default mainSchema;