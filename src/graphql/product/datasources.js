import { SQLDataSource } from '../datasources/sql/sql-datasource';
import { checkIsLoggedIn } from '../login/utils/login-functions';

export class ProductSQLDataSource extends SQLDataSource {
  constructor(dbConnection) {
    super(dbConnection);
    this.tableName = 'product';
  }

  async getById(id) {
    const product = await this.db(this.tableName)
      .where({ id })
      .first();
    product.imageUrl = product.image_url;
    return product;
  }

  async createProduct(product, loggedUserId) {
    checkIsLoggedIn(loggedUserId);
    const productId = await this.db(this.tableName)
      .insert({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        image_url: product.imageUrl,
      })
      .returning('id');
    product.id = productId[0].id;
    return product;
  }

  async updateProduct(product, loggedUserId) {
    checkIsLoggedIn(loggedUserId);
    await this.db(this.tableName)
      .update({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        image_url: product.imageUrl,
      })
      .where('id', '=', product.id);

    return true;
  }

  async deleteProduct(productId, loggedUserId) {
    checkIsLoggedIn(loggedUserId);
    await this.db(this.tableName)
      .where('id', '=', productId)
      .del();

    return true;
  }
}
