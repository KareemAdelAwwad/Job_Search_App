import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

export const userType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    provider: { type: GraphQLString },
    gender: { type: GraphQLString },
    dateOfBirth: { type: GraphQLString },
    mobileNumber: { type: GraphQLString },
    role: { type: GraphQLString },
    isConfirmed: { type: GraphQLBoolean },
    deletedAt: { type: GraphQLString },
    bannedAt: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  })
});

export const companyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    industry: { type: GraphQLString },
    address: { type: GraphQLString },
    numberOfEmployees: { type: GraphQLString },
    email: { type: GraphQLString },
    createdBy: { type: GraphQLID },
    HRs: { type: new GraphQLList(GraphQLID) },
    approvedByAdmin: { type: GraphQLBoolean },
    deletedAt: { type: GraphQLString },
    bannedAt: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  })
});