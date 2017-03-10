import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Button} from 'react-toolbox/lib/button';

export function render() {
  ReactDOM.render(
    <Button label="Hello World!"/>,
    getReactRoot()
  );
}

function getReactRoot() {
  const reactRoot = document.createElement("div");
  reactRoot.id = "react-root";
  document.body.appendChild(reactRoot);

  return reactRoot;
}