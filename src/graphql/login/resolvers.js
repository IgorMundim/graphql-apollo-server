export const login = async (_, { data }, { dataSources }) => {
  const { userName, password } = data;
  return dataSources.loginDb.login(userName, password);
};

export const logout = async (
  _,
  { userName },
  { dataSources, loggedUserId },
) => {
  return dataSources.loginDb.logout(userName, loggedUserId);
};

export const loginResolvers = {
  Mutation: { login, logout },
};
