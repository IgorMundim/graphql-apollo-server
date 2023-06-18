import { SQLDataSource } from '../datasources/sql/sql-datasource';
import { checkOwner } from '../login/utils/login-functions';
import {
  createUserFn,
  updateUserFn,
} from './utils/user-repository';

export class UserSQLDataSource extends SQLDataSource {
  constructor(dbConnection) {
    super(dbConnection);
    this.tableName = 'user';
  }
  async getUserByUserName(userName) {
    return await this.db(this.tableName).where(
      'user_name',
      '=',
      userName,
    );
  }
  async getById(id) {
    return await this.db(this.tableName)
      .select(
        'id',
        'first_name as firstName',
        'last_name as lastName',
        'user_name as userName',
        'reset_token',
        'created_at as createAt',
        'updated_at as updateAt',
      )
      .where('id', '=', id)
      .first();
  }

  async createUser(data) {
    const user = await createUserFn(data, this);
    return user;
  }

  async updateUser(data, loggedUserId) {
    checkOwner(data.id, loggedUserId);
    await updateUserFn(data.id, data, this);
    return true;
  }

  async deleteUser(id, loggedUserId) {
    checkOwner(id, loggedUserId);
    await this.db(this.tableName)
      .where({ id: loggedUserId })
      .del();
    return true;
  }
}
