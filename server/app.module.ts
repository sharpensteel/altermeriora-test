import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {DatabaseModule} from "./database/database.module";
import {FilesModule} from "./files/files.module";

@Module({
  imports: [
    DatabaseModule,
    FilesModule,
  ],
  controllers: [AppController],
})
export class AppModule {
}
