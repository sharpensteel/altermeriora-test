import {Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {FileDto} from './file.dto'; // @todo move common client/server code to `shared` directory
import {FileModel} from './file.model';
import {FilesService} from './files.service';


@Controller('files')
export class FilesController {

  constructor(readonly filesService: FilesService) {
  }

  static fileModelToDto(file: FileModel) {
    return new FileDto(file.id, file.filename);
  }

  @Get()
  async findAll(): Promise<FileDto[]> {
    const filesModels = await this.filesService.findAll();
    return filesModels.map(fileModel => FilesController.fileModelToDto(fileModel));
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileModel = await this.filesService.add(file.buffer, file.originalname);
    return FilesController.fileModelToDto(fileModel);
  }

  @Delete(':id')
  async deleteFile(@Param() params) {
    await this.filesService.remove(params.id);
  }
}




