import React from 'react';
import { Text } from 'react-native'


export const DateComponent = (props) => {
  const { date, style } = props;
  let dateString = ''
  if(date){
    dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }
  let styleObj = {}
  if(style){
    styleObj = style
  }

  return (
    <Text style={styleObj}>{dateString}</Text>
  )
}
