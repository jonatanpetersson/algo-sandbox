import * as React from 'react';

export interface IAppProps {}

export default class Canvas extends React.PureComponent<IAppProps> {
  public render() {
    return <canvas className="canvas"></canvas>;
  }
}
