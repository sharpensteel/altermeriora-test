import {Column, Index, Model, Table} from 'sequelize-typescript';

@Table({
  modelName: 'File'
})
export class FileModel extends Model<FileModel> {

  @Index({unique: true})
  @Column
  filename: string;

  @Column
  fileSize: number;
}
