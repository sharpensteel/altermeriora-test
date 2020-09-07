import {Module} from '@nestjs/common';
import {MulterModule} from '@nestjs/platform-express';
import {SequelizeModule} from '@nestjs/sequelize';
import {FileModel} from './file.model';
import {FilesController} from './files.controller';
import {FilesService} from './files.service';

@Module({
  imports: [
    SequelizeModule.forFeature([FileModel]),
    MulterModule.register({
      limits: {
        fileSize: 2e4,
      }
    }),
  ],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {
}