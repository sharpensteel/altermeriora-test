import 'antd/dist/antd.css';
import * as React from 'react';
import {FileUploader} from "../files/file-uploader";
import {IMakeUrl} from "../types";
import {AppBody} from "./app-body";
import './css/app.css';

interface IAppProps {
  makeUrl: IMakeUrl;
}

interface IAppState {
  uploadingProgress: number | false;
}

export class App extends React.PureComponent<IAppProps, IAppState> {

  constructor(props) {
    super(props);
    this.state = {
      uploadingProgress: 0,
    };
  }

  render() {
    return <React.Fragment>

      <FileUploader
        makeUrl={this.props.makeUrl}
        onProgressUpdated={progress => this.setState({uploadingProgress: progress})}
      />

      <AppBody uploadingProgress={this.state.uploadingProgress}/>

    </React.Fragment>;
  }
}
