import React from 'react'
import { View, Text} from 'react-native';

const AmountWithSymbol = (props) => {
  return(
    <View style={{flexDirection: 'row'}}>
      <View style={props.currencyContainerStyle}>
        <Text style={props.currencySymbolStyle}>{'\u20B9'}</Text>
      </View>
      <View style={props.amountContainerStyle}>
        <Text style={props.amountTextStyle}>
          {props.amount}
        </Text>
      </View>
    </View>
  )
}

AmountWithSymbol.propTypes = {
  currencyContainerStyle: React.PropTypes.number,
  amountContainerStyle: React.PropTypes.number,
  currencySymbolStyle: React.PropTypes.number,
  amountTextStyle: React.PropTypes.nummber,
  amount: React.PropTypes.string.isRequired,
}


export default AmountWithSymbol;
