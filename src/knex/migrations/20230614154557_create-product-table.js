/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('product', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('price').notNullable();
      table.string('image_url').notNullable();
      table.integer('quantity').notNullable();
      table.timestamps(true, true);
    })
    .createTable('cart_item', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('price').notNullable();
      table.string('image_url').notNullable();
      table.integer('quantity').notNullable();
      table.integer('product_id').notNullable();
      table.foreign('product_id').references('product.id');
      table.integer('user_id').notNullable().unsigned();
      table
        .foreign('user_id')
        .references('user.id')
        .onDelete('CASCADE');
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('product');
};
