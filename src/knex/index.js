import knexFn from 'knex';
import knexfile from './knexfile';
import { attachPaginate } from 'knex-paginate';
attachPaginate();
export const knex = knexFn(knexfile[process.env.NODE_ENV]);
