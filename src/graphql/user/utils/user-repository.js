import { GraphQLError } from 'graphql';
import bcrypt from 'bcrypt';

export const createUserFn = async (userData, dataSource) => {
  await checkUserFields(userData, true);
  const foundUser = await userExists(
    userData.userName,
    dataSource,
  );

  if (typeof foundUser !== 'undefined') {
    throw new GraphQLError(
      `userName ${userData.userName} has already been taken`,
      {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      },
    );
  }
  const user = await dataSource
    .db(dataSource.tableName)
    .insert({
      first_name: userData.firstName,
      last_name: userData.lastName,
      user_name: userData.userName,
      password_hash: userData.password_hash,
    })
    .returning('id');

  userData.id = user[0].id;
  return userData;
};

export const updateUserFn = async (
  userId,
  userData,
  dataSource,
) => {
  await checkUserFields(userData, false);

  if (!userId)
    throw new GraphQLError('Missing userId', {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    });

  if (userData.userName) {
    const foundUser = await userExists(
      userData.userName,
      dataSource,
    );

    if (typeof foundUser !== 'undefined') {
      throw new GraphQLError(
        `userName ${userData.userName} has already been taken`,
        {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        },
      );
    }
  }

  return dataSource
    .db(dataSource.tableName)
    .update({
      first_name: userData.firstName,
      last_name: userData.lastName,
      user_name: userData.userName,
    })
    .where({ id: userId });
};

const validateUserName = (userName) => {
  const userNameRegExp = /^[a-z]([a-z0-9_.-]+)+$/gi;

  if (!userName.match(userNameRegExp)) {
    throw new GraphQLError(
      'userName must match ${userNameRegExp}.',
      {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      },
    );
  }
};

const validateUserPassword = (password) => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,30}$/;

  if (!password.match(strongPasswordRegex)) {
    throw new GraphQLError(
      'Password must contain at least: ' +
        'One lower case letter, one upper case letter and one number.',
      {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      },
    );
  }
};

const userExists = async (userName, dataSource) => {
  const found = await dataSource.getUserByUserName(userName);
  return found[0];
};

const checkUserFields = async (
  user,
  allFieldsRequired = false,
) => {
  const userFields = [
    'firstName',
    'lastName',
    'userName',
    'password',
  ];
  for (const field of userFields) {
    if (!allFieldsRequired) {
      if (typeof user[field] === 'undefined') {
        continue;
      }
    }
    if (field === 'userName') {
      validateUserName(user[field]);
    }

    if (field === 'password') {
      validateUserPassword(user[field]);
    }

    if (!user[field]) {
      throw new Error(`Missing ${field}`);
    }
  }
  if (user.password && !user.passwordHash) {
    const { password } = user;
    const passwordHash = await bcrypt.hash(password, 12);
    user.password_hash = passwordHash;
    delete user['password'];
  }
};
