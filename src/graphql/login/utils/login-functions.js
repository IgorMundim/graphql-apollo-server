import { GraphQLError } from 'graphql';

export const checkIsLoggedIn = (loggedUserId) => {
  if (!loggedUserId) {
    throw new GraphQLError('You have to log in', {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    });
  }
};

export const checkOwner = (userId, loggedUserId) => {
  checkIsLoggedIn(loggedUserId);

  if (loggedUserId != userId) {
    throw new GraphQLError('You cannot update this user.', {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    });
  }
};
