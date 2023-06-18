import { knex } from '../knex';
import { UserSQLDataSource } from './user/datasources';
import jwt from 'jsonwebtoken';

const authorizeUser = async (req) => {
  const { headers } = req;
  const { authorization } = headers;
  try {
    const [_bearer, token] = authorization.split(' ');
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const userDb = new UserSQLDataSource(knex);
    const foundUser = await userDb.getById(userId);

    if (
      (!foundUser || foundUser.reset_token === '',
      foundUser.reset_token !== token)
    )
      return '';
    return userId;
  } catch (e) {
    return '';
  }
};

export const context = async ({ req, res }) => {
  const loggedUserId = await authorizeUser(req);
  return {
    loggedUserId,
    req,
    res,
  };
};
