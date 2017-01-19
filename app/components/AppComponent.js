import React from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNavigation from './BottomNavigation';
import ESNavigator from '../routes'


export default class App extends React.Component {
  constructor(){
    super()
  }

  render(){
    return (
      <View style={styles.container}>
         <ESNavigator />
         <BottomNavigation />
       </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});
