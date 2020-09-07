import * as React from "react";
import * as superagent from 'superagent';
import {Button, message, Upload} from "antd";
import {UploadOutlined} from '@ant-design/icons';
import {UploadFile, UploadProps} from "antd/lib/upload/interface";
import './css/files.css';
import {IMakeUrl} from "../types";
import {FileDto} from './file.dto';


interface IFileUploaderProps {
  makeUrl: IMakeUrl;
  onProgressUpdated?: (number) => void;
}

interface IFileUploaderState {
  files: UploadFile[],
  prevFilesUids: Set<string>,
  isServerFilesLoaded: boolean,
}


export class FileUploader extends React.PureComponent<IFileUploaderProps, IFileUploaderState> {
  private totalProgress: number | false;

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      prevFilesUids: new Set,
      isServerFilesLoaded: false,
    }
    this.totalProgress = 0;

    this.loadServerFiles();
  }

  static convertFileDtoToUploadFile(dto: FileDto): UploadFile {
    return {
      uid: `${dto.id}`,
      name: dto.filename,
      fileName: dto.filename,
      status: 'done',
      response: dto,
      percent: 100,
      size: 0,
      type: 'unknown',
    }
  }

  static addPrevFilesUids(prevFilesUids: Set<string>, files: UploadFile[]): Set<string> {
    return new Set([
      ...prevFilesUids,
      ...files.map(file => file.uid)
    ]);
  }

  static calcTotalProgress(files: UploadFile[]): number | false {
    let sizeTotal = 0;
    let sizeDownloaded = 0;

    for (let file of files) {
      if (file.status === 'error') {
        return false;
      }
      if (['uploading', 'success', 'done'].includes(file.status)) {
        sizeTotal += file.size || 0;
        sizeDownloaded += file.size * (file.percent / 100) || 0;
      }
    }
    return sizeTotal ? (sizeDownloaded / sizeTotal) * 100 : 0;
  }

  loadServerFiles() {
    superagent.get(this.props.makeUrl('files')).end((err, res) => {
      if (err) {
        message.error(`${err}`);
        this.setState({isServerFilesLoaded: false});
        return;
      }

      const filesDto: FileDto[] = res.body as FileDto[];

      const uploadFiles = filesDto.map(file => FileUploader.convertFileDtoToUploadFile(file));
      this.setState({
        files: [...this.state.files, ...uploadFiles],
        isServerFilesLoaded: true,
      });

    });
  }

  handleChange = info => {

    // make shallow copy of files for being able to detect changes in future
    let files: UploadFile[] = (info.fileList || []).map(file => ({...file}));

    this.setState({
      files,
      prevFilesUids: FileUploader.addPrevFilesUids(this.state.prevFilesUids, files.filter(file => file.status === 'removed')),
    });
  };

  componentDidUpdate(prevProps: Readonly<IFileUploaderProps>, prevState: Readonly<IFileUploaderState>, snapshot?: any) {

    const files = this.state.files.filter(file => !this.state.prevFilesUids.has(file.uid));
    const totalProgressNew = FileUploader.calcTotalProgress(files);

    if (totalProgressNew !== this.totalProgress) {
      this.totalProgress = totalProgressNew;
      this.props.onProgressUpdated && this.props.onProgressUpdated(totalProgressNew);
    }
  }

  beforeUpload() {
    const files = this.state.files.filter(file => file.status !== 'error');

    this.setState({
      files,
      prevFilesUids: FileUploader.addPrevFilesUids(this.state.prevFilesUids, files.filter(file => file.status !== 'uploading')),
    });
  }

  async onRemove(file: UploadFile) {
    if (file.response?.id) {
      await superagent.delete(this.props.makeUrl(`files/${file.response.id}`));
    }
    return true;
  }

  render() {
    const uploadProps: UploadProps = {
      fileList: this.state.files,
      action: this.props.makeUrl('files'),
      method: 'POST',
      onChange: this.handleChange.bind(this),
      onRemove: this.onRemove.bind(this),

      beforeUpload: () => {
        this.beforeUpload();
        return true;
      },
      multiple: true,
      progress: {
        strokeColor: {
          '0%': '#108ee9',
          '100%': '#87d068',
        },
        strokeWidth: 4,
        format: percent => `${percent.toFixed(0)}%`,
        // showInfo: true,
      },
    }

    return <div className='ff'>
      <div className='ff__title'>
        File uploading
      </div>
      <div className='ff__body'>
        <div className='ff__body__content'>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined/>} loading={!this.state.isServerFilesLoaded}>Click to Upload</Button>
          </Upload>
        </div>
      </div>
    </div>;
  }
}
