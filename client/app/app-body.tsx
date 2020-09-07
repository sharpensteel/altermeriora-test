import * as React from "react";
import {Helmet} from 'react-helmet';

interface IAppBodyProps {
  uploadingProgress: number | false;
}


export class AppBody extends React.PureComponent<IAppBodyProps> {
  /**
   * @param progressOrFail  total progress in percents
   */
  static bodyBackgroundByProgress(progressOrFail: number | false): string {
    if (progressOrFail === false) {
      return 'linear-gradient(90deg, rgba(219, 108, 65, 0.8) 0%, rgba(255,37,37,0.7) 30%, rgba(255,37,37,0.7) 80%, rgba(219, 108, 65, 0.8) 100%)';
    }

    const progress = Math.floor(progressOrFail as number);

    const lStop = Math.floor(-progress / 2);
    const clStop = Math.floor(50 - progress / 2);
    const crStop = 100 - clStop;
    const rStop = 100 + Math.floor(progress / 2);

    const progressColor = (startColor: number, endColor: number) =>
      Math.floor(startColor + (endColor - startColor) * (progress / 100));

    const lColor = 'rgb(244, 244, 244)';
    const rColor = lColor;
    const clColor = `rgba(${progressColor(244, 30)}, ${progressColor(244, 236)}, ${progressColor(244, 236)}, 0.5)`;
    const crColor = `rgba(${progressColor(244, 37)}, ${progressColor(244, 255)}, ${progressColor(244, 161)}, 0.5)`;

    return `linear-gradient(90deg,` +
      `${lColor} ${lStop}%,` +
      `${clColor} ${clStop}%, ` +
      `${crColor} ${crStop}%, ` +
      `${rColor} ${rStop}%)`;
  }

  render() {
    const bodyStyle = 'background: ' + AppBody.bodyBackgroundByProgress(this.props.uploadingProgress);

    return <Helmet bodyAttributes={{style: bodyStyle}}>
      <html lang="en"/>
    </Helmet>;
  }
}