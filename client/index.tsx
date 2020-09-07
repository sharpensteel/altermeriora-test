import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {stringify} from 'query-string';
import {App} from './app/app';


/**
 * simplest routing possible
 */
function makeRouteUrl(route: string, params?: {}): string {
  let url = `${location.origin}/${route}`;
  const paramsStr = params && stringify(params) || '';
  if (paramsStr) {
    url += `?${paramsStr}`;
  }
  return url;
}

ReactDOM.render(
  <App makeUrl={makeRouteUrl}/>,
  document.getElementById('app')
);
