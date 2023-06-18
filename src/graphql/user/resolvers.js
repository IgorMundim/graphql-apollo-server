const user = async (_, { id }, { dataSources }) => {
  const { userDb } = dataSources;
  return await userDb.getById(id);
};
const cart = ({ id }, _, { dataSources }) => {
  return dataSources.cartDb.getById(id);
};
const createUser = async (_, { data }, { dataSources }) => {
  return await dataSources.userDb.createUser(data);
};
const updateUser = async (
  _,
  { data },
  { dataSources, loggedUserId },
) => {
  return await dataSources.userDb.updateUser(data, loggedUserId);
};
const deleteUser = async (
  _,
  { id },
  { dataSources, loggedUserId },
) => {
  return await dataSources.userDb.deleteUser(id, loggedUserId);
};

export const userResolvers = {
  Query: { user },
  Mutation: { createUser, updateUser, deleteUser },
  User: { cart },
};
