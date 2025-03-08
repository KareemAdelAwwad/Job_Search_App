import { GraphQLList } from "graphql";
import * as Resolvers from "../Resolvers/index.js";
import * as Types from "../Types/index.js";

export const QueryFields = {
  listAllUsers: {
    type: new GraphQLList(Types.userType),
    resolve: Resolvers.listAllUsers
  },
  listAllCompanies: {
    type: new GraphQLList(Types.companyType),
    resolve: Resolvers.listAllCompanies
  }
};