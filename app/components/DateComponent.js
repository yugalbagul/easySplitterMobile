import React from 'react';
import { Text } from 'react-native'


export const DateComponent = (props) => {
  const { date } = props;
  let dateString = ''
  if(date){
    dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }
  return (
    <Text style={props.textStyle}>{dateString}</Text>
  )
}
