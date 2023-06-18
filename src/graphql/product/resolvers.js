const product = async (_, { id }, { dataSources }) => {
  const { productDb } = dataSources;
  return await productDb.getById(id);
};
const createProduct = async (
  _,
  { data },
  { dataSources, loggedUserId },
) => {
  return dataSources.productDb.createProduct(data, loggedUserId);
};
const updateProduct = async (
  _,
  { data },
  { dataSources, loggedUserId },
) => {
  return dataSources.productDb.updateProduct(data, loggedUserId);
};
const deleteProduct = async (
  _,
  { id },
  { dataSources, loggedUserId },
) => {
  return dataSources.productDb.deleteProduct(id, loggedUserId);
};
export const productResolvers = {
  Query: { product },
  Mutation: { createProduct, updateProduct, deleteProduct },
};
