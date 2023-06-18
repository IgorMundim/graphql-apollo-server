import { GraphQLError } from 'graphql';
import { SQLDataSource } from '../datasources/sql/sql-datasource';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class LoginSQLDataSource extends SQLDataSource {
  constructor(dbConnection) {
    super(dbConnection);
    this.tableName = 'user';
  }
  async getUser(userName) {
    const user = await this.db(this.tableName)
      .where('user_name', '=', userName)
      .first();

    if (!user) {
      throw new GraphQLError('User does not exist.', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }

    return user;
  }

  checkUserPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }

  createJwtToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  async login(userName, password) {
    const user = await this.getUser(userName);

    const { password_hash, id: userId } = user;
    const isPasswordValid = await this.checkUserPassword(
      password,
      password_hash,
    );

    if (!isPasswordValid) {
      throw new GraphQLError('Invalid password.', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }

    const token = this.createJwtToken({ userId });

    await this.db(this.tableName)
      .update({ reset_token: token })
      .where('id', '=', userId);

    return {
      userId,
      token,
    };
  }

  async logout(userName, loggedUserId) {
    const user = await this.getUser(userName);

    if (user.id !== loggedUserId) {
      throw new GraphQLError('You are not this user.', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }

    await this.db(this.tableName)
      .update({ reset_token: '' })
      .where('id', '=', user.id);
    return true;
  }
}
