import React from 'react';
import { View, StyleSheet, Text, Slider  } from 'react-native';
import { connect } from 'react-redux';
import { ROUTES } from '../constants';

class DishSplitScene extends React.Component {
  constructor(){
      super()
      this.state = {
        portionValue1: 0,
        maximumValue2: 5
      }
      this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(value){
    this.setState({
      portionValue1: value,
      maximumValue2: 5 - value,
    })

  }

  render() {
    const { dishData } = this.props;
    const { people } = this.props.billData;
    const { splitInfo } = dishData;
    return(
      <View style={styles.container}>
        <View style={styles.dishInfo}>
          <Text>Name : {dishData.dishName}</Text>
          <Text>Count : {dishData.count}</Text>
          <Text>Price Per Item : {dishData.pricePerItem}</Text>
          <Text>Total : {dishData.pricePerItem * dishData.count}</Text>
        </View>
        <View style={styles.dishSplit}>
          <Text>Max Value: {this.state.maximumValue2}</Text>
          <Slider
           maximumValue={this.state.maximumValue2}
           step={1}
           value={0}
           onValueChange={ this.onValueChange }
          >
          </Slider>
          <Text>--------------------------</Text>
          {splitInfo.dishSplit.map((personSplitInfo) => {
            const personInfo = people.find((item) => item.userID == personSplitInfo.userID)
          return (  <View style={styles.dishSplitPerson} key={personInfo.userID}>
               <Text>
                Name : {personInfo.name}
               </Text>
               <Text>
                Portion : {this.state.portionValue1}
               </Text>
               <Slider
                maximumValue={5}
                step={1}
                value={this.state.portionValue1}
                onValueChange={ this.onValueChange }
               >
               </Slider>
               <Text>
                Dish Amount: {personSplitInfo.dishAmount}
               </Text>
               </View>)
          })}
        </View>
      </View>

    )
  }
}

DishSplitScene.propTypes = {
  billRecords: React.PropTypes.array,
}

const styles  = StyleSheet.create({
  container : {
    flex: 1,
    padding: 10
  },
  dishInfo : {
    minHeight: 50,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black',
    paddingVertical: 10
  },
  dishSplit: {
    paddingVertical: 10
  }
})

const matchStateToProps = (state) => {
  const billRecords = state.get('billRecordsReducer') && state.get('billRecordsReducer').toJS ? state.get('billRecordsReducer').toJS() : [];
  return {

  }
}

export default connect(matchStateToProps)(DishSplitScene);
