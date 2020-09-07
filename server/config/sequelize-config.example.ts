import {Options} from 'sequelize/types/lib/sequelize';

export const SEQUELIZE_CONFIG: Options = {
  "dialect": "sqlite",
  "storage": `${__dirname}/../../tmp/db.sqlite`,
  "database": null,
  "username": null,
  "password": null
}
