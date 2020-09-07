import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {SEQUELIZE_CONFIG} from "../config/sequelize-config";
import {FileModel} from "../files/file.model";


@Module({
  imports: [
    SequelizeModule.forRoot({
      ...SEQUELIZE_CONFIG,
      models: [FileModel],
      synchronize: true,

      /* due to bug in @nestjs/sequelize, it's the only way to make `synchronize: true` to work */
      autoLoadModels: true,
    }),
  ],
  exports: [
    SequelizeModule,
  ]
})
export class DatabaseModule {
}

