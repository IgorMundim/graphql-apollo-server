import { gql } from 'apollo-server';

export const cartTypeDefs = gql`
  extend type Mutation {
    addItemCart(data: AddCartInput!): CartItem
    updateItemCart(data: UpdateCartInput!): Boolean!
    deleteItemCart(id: ID!): Boolean!
  }
  extend type Query {
    cart(user_id: ID!): [CartItem!]
  }

  input AddCartInput {
    name: String!
    price: Int!
    imageUrl: String!
    quantity: Int!
    productId: ID!
    userId: ID!
  }
  input UpdateCartInput {
    id: ID!
    quantity: Int
  }

  type CartItem {
    id: ID!
    name: String!
    price: Int!
    imageUrl: String!
    quantity: Int!
    user: User!
  }
`;
