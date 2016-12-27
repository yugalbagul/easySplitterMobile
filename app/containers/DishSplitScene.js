import React from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { isEmpty } from 'lodash';
import CheckBox from 'react-native-checkbox';
import { connect } from 'react-redux';
import { ROUTES } from '../constants';
import dishSplitCalculator from '../utils/dishSplitCalculator';

class DishSplitScene extends React.Component {
  constructor(){
    super();
    this.onUserPortionChange = this.onUserPortionChange.bind(this);
    this.updateOnDishPriceChange = this.updateOnDishPriceChange.bind(this);
    this.setNewDishPrice = this.setNewDishPrice.bind(this);
    this.saveDishSplit = this.saveDishSplit.bind(this);
    this.onPersonSelectToggle = this.onPersonSelectToggle.bind(this);
  }

  componentWillMount(){
    const { dishData, newItem }  = this.props
    if(newItem) {
      this.setState({
        currentBaseSplitAmount: 0,
        currentTotalSplits: 0,
        currentDishSplit: [],
        currentPricePerItem: '',
        currentDishCount: '',
        currentDishName: '',
        editName: true,
      });
    } else if(dishData && !isEmpty(dishData.splitInfo)){
      const { splitInfo } = dishData;
      const {
        totalSplits,
        baseSplitAmount,
        dishSplit,
      } = splitInfo;
      const tempCurrentDishSplit = [];
      dishSplit.map((item) => {
        const newItem = Object.assign({}, item, { selected: true});
        tempCurrentDishSplit.push(newItem);
      })
      this.setState({
        currentBaseSplitAmount: baseSplitAmount,
        currentTotalSplits: totalSplits,
        currentDishSplit: tempCurrentDishSplit,
        currentPricePerItem: dishData.pricePerItem,
        currentDishCount: dishData.count,
        currentDishName: dishData.dishName,
      })
    }
    else if(dishData && isEmpty(dishData.splitInfo)){
      this.setState({
        currentBaseSplitAmount: 0,
        currentTotalSplits: 0,
        currentDishSplit: [],
        currentPricePerItem: dishData.pricePerItem,
        currentDishCount: dishData.count,
        currentDishName: dishData.dishName,
      })
    }
  }

  saveDishSplit(){
    const { dishSplitActions, billRecordIndex } = this.props;
    const {
      currentDishCount,
      currentDishName,
      currentPricePerItem,
      currentBaseSplitAmount,
      currentTotalSplits,
      currentDishSplit
    } = this.state;
    if(currentDishCount && currentDishName && currentPricePerItem){
      const { newItem,dishID, billData } = this.props;
      const typeConvertedDishSplit = [];
      // convert strings to floats for each user reacord
      currentDishSplit.map((userSplitInfo) => {
        const tempUserSplitInfo = userSplitInfo;
        let { splitPortion, dishAmount } = tempUserSplitInfo
        if(tempUserSplitInfo.selected && (splitPortion && splitPortion !== '0')){
          tempUserSplitInfo.splitPortion = splitPortion ? parseFloat(splitPortion) : 0;
          tempUserSplitInfo.dishAmount = dishAmount ? parseFloat(dishAmount) : 0;
          delete tempUserSplitInfo.selected;
          delete tempUserSplitInfo.previousSplitPortion;
          typeConvertedDishSplit.push(tempUserSplitInfo);
        }

      })
      let tempDishId = dishID;
      if(tempDishId === undefined){
        tempDishId = billData.dishes.length;
      }
      const newDishBasicInfo = {
        dishID: tempDishId,
        count: currentDishCount,
        dishName: currentDishName,
        pricePerItem:  currentPricePerItem,
      };
      const newDishSplitInfo = {
        dishID: tempDishId,
        baseSplitAmount: currentTotalSplits?currentBaseSplitAmount:0, // if 0 splits , make the Infinity base amount to 0
        totalSplits: currentTotalSplits,
        dishSplit: typeConvertedDishSplit
      }
      dishSplitActions.saveDishSplitAction(billRecordIndex, billData.billID, newDishBasicInfo, newDishSplitInfo, newItem);
      this.props.navigator.replacePreviousAndPop({title: 'Bill Split Page', billRecordIndex: billRecordIndex, routeName: ROUTES.billSplitPage});
    }


  }

  onPersonSelectToggle(checked, index){
    const { people } = this.props.billData;
    if(!checked){
      const newState = Object.assign({}, this.state,
        dishSplitCalculator('USER_SELECTION_ADDED', index, people, this.state));
      this.setState(newState);
    } else {
      const newState = Object.assign({}, this.state,
        dishSplitCalculator('USER_SELECTION_REMOVED', index, people, this.state));
      this.setState(newState);
    }

  }

  setNewDishPrice(event, attribute){
    const newText = event.nativeEvent.text;
    const isNumber = /^\d+(?:\.)?(?:\d+)?$/.test(newText);
    const { currentDishCount, currentPricePerItem } = this.state;
    if((!newText && attribute === 'count')){
      this.setState({
        currentDishCount: newText
      });
    } else if(!newText && attribute === 'pricePerItem'){
      this.setState({
        currentPricePerItem: newText,
      });
    } else if(newText && isNumber && attribute === 'count'){
      this.updateOnDishPriceChange(newText,currentPricePerItem, attribute);
    } else if(newText && isNumber && attribute === 'pricePerItem'){
      this.updateOnDishPriceChange(currentDishCount, newText, attribute);
    }

  }

  updateOnDishPriceChange(dishCount, pricePerItem, attribute){
    const { currentTotalSplits, currentDishSplit } = this.state;
    // TODO: send current state rather than passing only required attributes,
    // will make the function usage uniform
    const newState = Object.assign({}, this.state, dishSplitCalculator('DISH_PRICE_CHANGE', dishCount, pricePerItem, currentTotalSplits, currentDishSplit, attribute))
    this.setState(newState);
  }

  onUserPortionChange(event, index){
    let newInputText = event.nativeEvent.text;
    const tempCurrentDishSplit = this.state.currentDishSplit;
    const isNumber = /^\d+(?:\.)?(?:\d+)?$/.test(event.nativeEvent.text);
    const tempUserSplitRecord = tempCurrentDishSplit[index];
    if(isNumber){
      // code to recalculate the current base split and currentTotalSplits
      const newState = Object.assign({}, this.state, dishSplitCalculator('USER_PORTION_CHANGED', newInputText, index, this.state));
      this.setState(newState);
    } else if (!newInputText){
      tempUserSplitRecord.previousSplitPortion = tempUserSplitRecord.splitPortion;
      tempUserSplitRecord.splitPortion = newInputText;
      tempCurrentDishSplit[index] = tempUserSplitRecord;
      this.setState({
        currentDishSplit: tempCurrentDishSplit,
      });
    }
  }

  render() {
    const { people } = this.props.billData;
    const { currentPricePerItem ,currentDishCount, editName, currentDishName } = this.state;
    const totalDishAmount = !currentDishCount || !currentPricePerItem ? '' : (currentPricePerItem * currentDishCount);
    const disableSplitSection = totalDishAmount ? false : true;
    return(
        <View style={styles.container}>

          <View style={styles.dishInfo}>

            <View style={styles.dishInfoDishName}>
              <View style={{
                flexDirection: 'row'
              }}>
                <Icon name={'rocket'} size={15} color="#900" style={styles.dishNameIcon} />
                {editName ?
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                        value={currentDishName}
                        onChange= {(event) => {this.setState({currentDishName: event.nativeEvent.text})}}
                        style={{width:200, height: 40, marginBottom: 5}}
                    />
                  <TouchableOpacity onPress={()=>{this.setState({editName: !this.state.editName})}}>
                    <Icon name={'thumbs-up'} size={15} color="grey"  style={styles.dishNameIcon} />
                  </TouchableOpacity>
                  </View> :
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.dishName}>{currentDishName}</Text>
                      <TouchableOpacity onPress={()=>{this.setState({editName: !this.state.editName})}}>
                        <Icon name={'pencil'} size={15} color="grey"  style={styles.dishNameIcon} />
                      </TouchableOpacity>
                  </View>
                }
              </View>

              <View style={{
                alignSelf:'flex-end'
              }}>
                <TouchableOpacity onPress={this.saveDishSplit}>
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.dishInfoDishAmount}>
              <Text>Total Amount: </Text>
              <View style={styles.dishAmountInputContainer}>
                <TextInput
                  keyboardType={'numeric'}
                  value={currentDishCount.toString()}
                  onChange={(event) => {
                    this.setNewDishPrice(event, 'count')
                  }}
                  style={{width:50, height: 40, marginBottom: 5}}
                />
              <Text>X</Text>
                <TextInput
                  keyboardType={'numeric'}
                  value={currentPricePerItem.toString()}
                  onChange={(event) => {
                    this.setNewDishPrice(event, 'pricePerItem')
                  }}
                  style={{width:50, height: 40, marginBottom: 5}}
                />
              </View>
              <Text> = </Text>
              <Text>{totalDishAmount ? totalDishAmount : '-'}</Text>
            </View>
          </View>


          <View style={styles.dishSplit}>
            <Text> Split Between : </Text>
          <ScrollView contentContainerStyle={styles.dishSplitScroll}>
            {
              people.map((personInfo, index) => {
                const personSplitInfo = this.state.currentDishSplit.find((item) => item.userID == personInfo.userID);
                if(personSplitInfo){
                  return (  <View style={styles.dishSplitPerson} key={personInfo.userID}>
                  <CheckBox
                    checked={personSplitInfo.selected}
                    label={personInfo.name}
                    onChange={(checked) => {if(!disableSplitSection){
                      this.onPersonSelectToggle(checked, index)}}}
                  />
                   <TextInput
                      keyboardType={'numeric'}
                      value={personSplitInfo.splitPortion.toString()}
                      onChange={(event) => {this.onUserPortionChange(event, index )}}
                      style={{width:50, height: 40, marginBottom: 5}}
                      editable={!disableSplitSection}
                    />

                   <Text>
                    {personSplitInfo.dishAmount}
                   </Text>
                 </View>)
                } else {
                  return (
                    <View style={styles.dishSplitPerson} key={personInfo.userID}>
                    <CheckBox
                      checked={ personSplitInfo && personSplitInfo.selected ? personSplitInfo.selected : false}
                      label={personInfo.name}
                      onChange={(checked) => {if(!disableSplitSection){
                        this.onPersonSelectToggle(checked, index)}}}
                    />
                     <TextInput
                        keyboardType={'numeric'}
                        value={''}
                        editable= {false}
                        style={{width:50, height: 40, marginBottom: 5}}
                      />

                     <Text>
                      -
                     </Text>
                   </View>
                  )
                }

              })
          }
          </ScrollView>
        </View>

        </View>

    )
  }
}

export default connect(null,null)(DishSplitScene);

DishSplitScene.propTypes = {
  billData: React.PropTypes.object,
  dishData: React.PropTypes.object,
  dishSplitActions: React.PropTypes.object,
  dishID: React.PropTypes.number,
  billRecordIndex: React.PropTypes.string,
  newItem: React.PropTypes.bool,
  navigator: React.PropTypes.object,
}

const styles  = StyleSheet.create({
  container : {
    flex: 1,
    padding: 10,
  },
  dishInfo : {
    minHeight: 50,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black',
    flexDirection: 'column',
    paddingVertical: 10
  },
  dishInfoDishName:{
    flexDirection: 'row',
    justifyContent:'space-between',
    paddingBottom: 5,
    paddingHorizontal: 10,
    backgroundColor:'whitesmoke'
  },
  dishInfoDishAmount : {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dishAmountInputContainer: {
    flexDirection : 'row',
  },
  dishSplit: {
    paddingVertical: 10
  },
  dishSplitScroll: {
    borderTopWidth : StyleSheet.hairlineWidth,
    marginTop: 10,
  },
  dishNameIcon :{
    top: 5,
    marginRight: 5,
  },
  dishName: {
    fontFamily: 'Roboto',
    fontSize: 20,
  },
  // split section styles
  dishSplitPerson: {
    flexDirection:'row',
    justifyContent:'space-around',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

})
