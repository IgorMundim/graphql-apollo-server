import { GraphQLError } from 'graphql';
import { SQLDataSource } from '../datasources/sql/sql-datasource';
import { checkIsLoggedIn } from '../login/utils/login-functions';

export class CartSQLDataSource extends SQLDataSource {
  constructor(dbConnection) {
    super(dbConnection);
    this.tableName = 'cart_item';
  }

  async getById(id) {
    return await this.db(this.tableName).where(
      'user_id',
      '=',
      id,
    );
  }

  async createCart(cart, loggedUserId) {
    checkIsLoggedIn(loggedUserId);

    const cartId = await this.db(this.tableName)
      .insert({
        name: cart.name,
        price: cart.price,
        quantity: cart.quantity,
        image_url: cart.imageUrl,
        product_id: cart.productId,
        user_id: loggedUserId,
      })
      .returning('id');
    cart.id = cartId[0].id;

    return cart;
  }

  async updateCart(cart, loggedUserId) {
    checkIsLoggedIn(loggedUserId);
    try {
      const newData = await this.db(this.tableName)
        .update({
          quantity: cart.quantity,
        })
        .where({ id: cart.id, user_id: loggedUserId });
      if (!newData) {
        throw new GraphQLError(
          'User does not exist or you are not the owner.',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          },
        );
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  async deleteCart(id, loggedUserId) {
    checkIsLoggedIn(loggedUserId);
    try {
      const newData = await this.db(this.tableName)
        .where({ id: id, user_id: loggedUserId })
        .del();
      if (!newData) {
        throw new GraphQLError(
          'User does not exist or you are not the owner.',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          },
        );
      }
    } catch (e) {
      return false;
    }

    return true;
  }

  async batchLoaderCallback(user_ids) {
    const query = this.db(this.tableName).whereIn(
      'user_id',
      user_ids,
    );
    const carts = await query;
    const filteredCart = user_ids.map((user_id) => {
      return carts.filter(
        (cart) => String(cart.user_id) === String(user_id),
      );
    });
    return filteredCart;
  }
}
