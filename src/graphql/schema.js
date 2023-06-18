import { gql } from 'apollo-server';
import { userTypeDefs } from './user/types';
import { userResolvers } from './user/resolvers';
import { productTypeDefs } from './product/types';
import { productResolvers } from './product/resolvers';
import { cartTypeDefs } from './cart/types';
import { cartResolvers } from './cart/resolvers';
import { loginTypedefs } from './login/typesdefs';
import { loginResolvers } from './login/resolvers';

const rootTypeDefs = gql`
  type Query {
    _empty: Boolean
  }
  type Mutation {
    _empty: Boolean
  }
`;

const rootResolvers = {
  Query: {
    _empty: () => true,
  },
  Mutation: {
    _empty: () => true,
  },
};

export const typeDefs = [
  rootTypeDefs,
  userTypeDefs,
  productTypeDefs,
  cartTypeDefs,
  loginTypedefs,
];

export const resolvers = [
  rootResolvers,
  userResolvers,
  productResolvers,
  cartResolvers,
  loginResolvers,
];
