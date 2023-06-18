import { gql } from 'apollo-server';

export const productTypeDefs = gql`
  extend type Query {
    product(id: ID!): Product!
  }
  extend type Mutation {
    createProduct(data: CreateProductInput!): Product!
    updateProduct(data: UpdateProductInput!): Boolean!
    deleteProduct(id: ID!): Boolean!
  }

  type Product {
    id: ID!
    price: Int!
    name: String!
    quantity: Int!
    imageUrl: String!
  }
  input CreateProductInput {
    price: Int!
    quantity: Int!
    name: String!
    imageUrl: String!
  }
  input UpdateProductInput {
    id: ID!
    price: Int
    quantity: Int
    name: String
    imageUrl: String
  }
`;
