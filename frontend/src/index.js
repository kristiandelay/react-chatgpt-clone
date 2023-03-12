import React from "react";
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import customStore from './customStore'

const store = customStore();

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./App', renderApp);
}

renderApp();

reportWebVitals();
