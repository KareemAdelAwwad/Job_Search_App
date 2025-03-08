import { GraphQLNonNull, GraphQLString } from "graphql";
import * as Resolvers from "../Resolvers/index.js";

export const MutationFields = {
  banUser: {
    type: GraphQLString,
    args: {
      userId: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: (__, args) => Resolvers.banUser(args)
  },
  unbanUser: {
    type: GraphQLString,
    args: {
      userId: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: (__, args) => Resolvers.unbanUser(args)
  },
  banCompany: {
    type: GraphQLString,
    args: {
      companyId: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: (__, args) => Resolvers.banCompany(args)
  },
  unbanCompany: {
    type: GraphQLString,
    args: {
      companyId: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: (__, args) => Resolvers.unbanCompany(args)
  },
  approveCompany: {
    type: GraphQLString,
    args: {
      companyId: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: (__, args) => Resolvers.approveCompany(args)
  }
};