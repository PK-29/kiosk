import React from 'react'
import ReactDOM from 'react-dom'

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import App from './js/app'
import registerServiceWorker from './registerServiceWorker'
import './css/index.css'
import { store } from './js/redux.js'
import {Provider} from 'react-redux'

ReactDOM.render(
    <Provider store={store}>
        <div className="app">
            <Router basename={'/'}>
                <Route path="" component={App} />
            </Router>
        </div>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
