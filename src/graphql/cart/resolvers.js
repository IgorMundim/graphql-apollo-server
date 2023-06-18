const cart = async (_, { user_id }, { dataSources }) => {
  const { cartDb } = dataSources;
  return await cartDb.getById(user_id);
};

const addItemCart = async (
  _,
  { data },
  { dataSources, loggedUserId },
) => {
  return await dataSources.cartDb.createCart(data, loggedUserId);
};

const updateItemCart = async (
  _,
  { data },
  { dataSources, loggedUserId },
) => {
  return await dataSources.cartDb.updateCart(data, loggedUserId);
};

const deleteItemCart = async (
  _,
  { id },
  { dataSources, loggedUserId },
) => {
  return await dataSources.cartDb.deleteCart(id, loggedUserId);
};

export const cartResolvers = {
  Query: { cart },
  Mutation: { addItemCart, updateItemCart, deleteItemCart },
};
