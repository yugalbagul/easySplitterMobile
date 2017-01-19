import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import { Provider } from 'react-redux'
import store from './app/store/configureStore'
import App from './app/components/AppComponent'

export default class easySplitterMobile extends Component {
  render() {
    return (
      <Provider store = {store}>
        <App />
      </Provider>
    );
  }
}



AppRegistry.registerComponent('easySplitterMobile', () => easySplitterMobile);
