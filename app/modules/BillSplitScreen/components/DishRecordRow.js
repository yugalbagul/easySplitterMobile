import React from 'react'
import { View, TouchableNativeFeedback, Text} from 'react-native';
import { dishRowStyles } from '../styles';

const DishRecordRow = (props) => {
  const { rowData } = props
  return(
    <TouchableNativeFeedback style={dishRowStyles.item} onPress={props.onDishRecordPress.bind(this,rowData)}>
      <View>
        <Text>{rowData.dishName}</Text>
        <Text>{rowData.pricePerItem}</Text>
      </View>
    </TouchableNativeFeedback>
  )
}

DishRecordRow.propTypes = {
  rowData: React.PropTypes.object,
  onDishRecordPress: React.PropTypes.func
}

export default DishRecordRow;
