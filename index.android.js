import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import { Provider } from 'react-redux'
import store from './app/store/configureStore'
import ESNavigator from './app/routes'

export default class easySplitterMobile extends Component {
  render() {
    return (
      <Provider store = {store}>
       <View style={styles.container}>
          <ESNavigator />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('easySplitterMobile', () => easySplitterMobile);
