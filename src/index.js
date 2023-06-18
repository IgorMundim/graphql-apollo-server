import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from './graphql/schema';
import { UserSQLDataSource } from './graphql/user/datasources';
import { knex } from './knex';
import { CartSQLDataSource } from './graphql/cart/datasources';
import { ProductSQLDataSource } from './graphql/product/datasources';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import { context } from './graphql/context';
import { LoginSQLDataSource } from './graphql/login/datasources';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  dataSources: () => {
    return {
      userDb: new UserSQLDataSource(knex),
      cartDb: new CartSQLDataSource(knex),
      productDb: new ProductSQLDataSource(knex),
      loginDb: new LoginSQLDataSource(knex),
    };
  },
  plugins: [
    // Install a landing page plugin based on NODE_ENV
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageProductionDefault({
          graphRef: 'my-graph-id@my-graph-variant',
          footer: false,
        })
      : ApolloServerPluginLandingPageLocalDefault({
          footer: false,
        }),
  ],
});

server.listen(4003).then(({ url }) => {
  console.log(`Server listening on url ${url}`);
});
