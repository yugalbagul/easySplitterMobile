import React from 'react';
import { Text } from  'react-native'
import { MY_NAME } from './constants';

export class Welcome extends React.Component {
 render () {
  return (
    <Text> Welcome Bro { MY_NAME } </Text>
  )
 }
}
