import { gql } from 'apollo-server';

export const userTypeDefs = gql`
  extend type Query {
    user(id: ID!): User!
  }
  extend type Mutation {
    createUser(data: CreateUserInput!): User!
    updateUser(data: UpdateUserInput!): Boolean!
    deleteUser(id: ID!): Boolean!
  }
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    userName: String!
    createAt: String
    updateAt: String
    cart: [CartItem!]
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    userName: String!
    password: String!
  }
  input UpdateUserInput {
    id: ID!
    firstName: String
    lastName: String
    userName: String
    password: String
  }
`;
