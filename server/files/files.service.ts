import {Injectable} from '@nestjs/common';
import {InjectConnection, InjectModel} from '@nestjs/sequelize';
import {Op, Sequelize} from 'sequelize';
import {FileModel} from './file.model';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(FileModel)
    private fileModel: typeof FileModel,
    @InjectConnection()
    private connection: Sequelize
  ) {
  }

  async findAll(): Promise<FileModel[]> {
    return this.fileModel.findAll();
  }

  findOne(id: string): Promise<FileModel> {
    return this.fileModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const file = await this.findOne(id);
    await file.destroy();
  }

  async add(buffer: Buffer, filename: string): Promise<FileModel> {
    const uniqueFilename = await this.generateUniqueFilename(filename);

    const file = await this.fileModel.create({
      filename: uniqueFilename,
      fileSize: buffer.byteLength,
    });

    return file;
  }

  protected async generateUniqueFilename(filename: string): Promise<string> {

    const exFilename = await this.fileModel.findOne({attributes: ['id'], where: {filename}});
    if (!exFilename) {
      return filename;
    }

    const exFiles = await this.fileModel.findAll({
      attributes: ['filename'],
      where: {
        filename: {[Op.like]: `${filename}(%)`}, // @todo: check `like` escaping in sequelize
      }
    });

    const exFilenames = new Set(exFiles.map(file => file.filename));

    let newFilename = null;
    for (let i = 1; ; i++) {
      newFilename = `${filename}(${i})`;
      if (!exFilenames.has(newFilename)) {
        break;
      }
    }

    return newFilename;
  }

}

