import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import * as path from 'path';
import {AppModule} from './app.module';
// import { Sequelize } from 'sequelize';
// import {SEQUELIZE_CONFIG} from "./config/sequelize-config";
// import {QueryTypes} from "sequelize";

//const sequelize = new Sequelize(SEQUELIZE_CONFIG);

async function bootstrap() {

  //await sequelize.sync();
  // const a = await sequelize.query('SELECT 2+2', {
  //   // A function (or false) for logging your queries
  //   // Will get called for every SQL query that gets sent
  //   // to the server.
  //   logging: console.log,
  //
  //   // Set this to true if you don't have a model definition for your query.
  //   raw: false,
  //
  //   // The type of query you are executing. The query type affects how results are formatted before they are passed back.
  //   type: QueryTypes.SELECT
  // });
  // console.log(a);

  // const b = FileModel.defineModel(sequelize);
  // console.log(await b.findAll());
  //
  // //await b.create({basename: 'asd.txt'});
  //
  // //await sequelize.sync({ force: true });
  //


  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.useStaticAssets(path.resolve(__dirname, '../public'));
  app.setBaseViewsDir(path.resolve(__dirname, '../views'));
  app.setViewEngine('hbs');

  await app.listen(3000);
  //
  // const app = await NestFactory.createApplicationContext(AppModule);
  // const s = app.get(Sequelize);
  // const r = await s.query('select 1+1');
  // console.log(r);

}

bootstrap().catch(e => console.error(e));
