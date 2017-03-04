import React from 'react';
import { View, Text, ScrollView, Image  } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { isEmpty } from 'lodash';
import { Actions } from 'react-native-router-flux'
import { MKTextField, MKCheckbox } from 'react-native-material-kit'
import { ROUTES } from '../../constants';
import AmountWithSymbol from '../../components/AmountWithSymbol'
import dishSplitCalculator from '../../utils/dishSplitCalculator';
import { toolBarStyle, styles } from './styles';

export default class DishSplitScene extends React.Component {
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
    const baseNewState = {
      currentBaseSplitAmount: 0,
      currentTotalSplits: 0,
      currentDishSplit: [],
      currentDishTotalPrice: '',
      currentDishCount: '',
      currentDishName: '',
    }
    if(newItem) {
      this.setState(baseNewState);
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
        currentDishTotalPrice: dishData.dishTotalPrice,
        currentDishCount: dishData.count,
        currentDishName: dishData.dishName,
      })
    }
    else if(dishData && isEmpty(dishData.splitInfo)){
      this.setState(Object.assign({}, baseNewState,{
        currentDishTotalPrice: dishData.dishTotalPrice,
        currentDishCount: dishData.count,
        currentDishName: dishData.dishName,
      }))
    }
  }

  saveDishSplit(){
    const { dishSplitActions, billRecordID } = this.props;
    const {
      currentDishCount,
      currentDishName,
      currentDishTotalPrice,
      currentBaseSplitAmount,
      currentTotalSplits,
      currentDishSplit
    } = this.state;
    if(currentDishName && currentDishTotalPrice){
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
        dishTotalPrice:  currentDishTotalPrice,
      };
      const newDishSplitInfo = {
        dishID: tempDishId,
        baseSplitAmount: currentTotalSplits?currentBaseSplitAmount:0, // if 0 splits , make the Infinity base amount to 0
        totalSplits: currentTotalSplits,
        dishSplit: typeConvertedDishSplit
      }
      dishSplitActions.saveDishSplitAction(billRecordID, newDishBasicInfo, newDishSplitInfo, newItem);
      Actions[ROUTES.billSplitPage]();
    }


  }

  onPersonSelectToggle(checked, id){
    const { people } = this.props;
    
    if(checked){
      const newState = Object.assign({}, this.state,
        dishSplitCalculator('USER_SELECTION_ADDED', id, people, this.state));
      this.setState(newState);
    } else {
    //  const newState = Object.assign({}, this.state,
        //dishSplitCalculator('USER_SELECTION_REMOVED', id, this.state));
      //this.setState(newState);
    }

  }

  setNewDishPrice(event){
    const newText = event.nativeEvent.text;
    const isNumber = /^\d+(?:\.)?(?:\d+)?$/.test(newText);
    if(newText && isNumber){
      this.updateOnDishPriceChange(newText);
    } else if(newText === ''){
      this.setState({
        currentDishTotalPrice: newText,
      });
    }
  }

  updateOnDishPriceChange(dishTotalPrice){
    const { currentTotalSplits, currentDishSplit } = this.state;
    // TODO: send current state rather than passing only required attributes,
    // will make the function usage uniform
    const newState = Object.assign({}, this.state, dishSplitCalculator('DISH_PRICE_CHANGE', dishTotalPrice, currentTotalSplits, currentDishSplit))
    this.setState(newState);
  }

  onUserPortionChange(event, id){
    let newInputText = event.nativeEvent.text;
    const isNumber = /^\d+(?:\.)?(?:\d+)?$/.test(newInputText);
    const index = this.state.currentDishSplit.findIndex((item) => item.id == id);
    if(isNumber){
      // code to recalculate the current base split and currentTotalSplits
      const newState = Object.assign({}, this.state, dishSplitCalculator('USER_PORTION_CHANGED', newInputText, index, this.state));
      this.setState(newState);
    } else if (!newInputText){
      const newState = Object.assign({}, this.state, dishSplitCalculator('USER_PORTION_CHANGED', '', index, this.state));
      this.setState(newState);
    }
  }

  render() {
    const { people } = this.props;
    const { currentDishTotalPrice, currentDishName } = this.state;
    const disableSplitSection = currentDishTotalPrice ? false : true;
    return(
        <View style={styles.container}>
          <MaterialIcons.ToolbarAndroid
            style= {{
              backgroundColor: '#18435A',
              height: 56,
              elevation: 10,
            }}
            navIconName= 'arrow-back'
            iconColor= 'white'
            actions={[
              {
                title:'Done',
                iconName: 'done',
                iconColor: 'white',
                show: 'always'
              }
            ]}
            onActionSelected={this.saveDishSplit}
            onIconClicked={this.onRequestCloseHandler}
          >
          <View style={toolBarStyle.toolBarContainer}>
              <Text style={toolBarStyle.titleStyle}>
                Add Item
              </Text>
          </View>
        </MaterialIcons.ToolbarAndroid>
          <View style={styles.dishInfoContainer}>
            <View style={styles.dishNameContainer}>
                <View style={styles.dishImageOuterContainer}>
                  <View style={styles.dishImageInnerContainer}>
                    <Image source={require('../../../assets/food_icons/default.png')} style={styles.dishImage}/>
                  </View>
                </View>
                <View style={styles.dishNameInputCotainer}>
                  <MKTextField
                    autoCorrect={false}
                    value={currentDishName}
                    onChange= {(event) => {this.setState({currentDishName: event.nativeEvent.text})}}
                    style={{flex:1}}
                    highlightColor={'#159688'}
                    textInputStyle={{ color: '#276191'}}
                    />
                </View>
            </View>

            <View style={styles.dishPriceContianer}>
              <View style={styles.amountIconContainer}>
                <Text style={styles.amountIconStyle}> {'\u20B9'}</Text>
              </View>
              <View style={styles.amountInputContainer}>
                <MKTextField
                  autoCorrect={false}
                  value={currentDishTotalPrice.toString()}
                  onChange={(event) => {
                    this.setNewDishPrice(event)
                  }}
                  style={{flex:1}}
                  highlightColor={'#159688'}
                  textInputStyle={{ color: '#276191'}}
                  />
              </View>
            </View>
          </View>


          <View style={styles.dishSplitInfoContainer}>
            <View style={styles.separatorTextContainer}>
              <Text style={styles.separatorText}> Split Between </Text>
            </View>

            <View style={[styles.dishSplitPersonContainer, styles.columnLabelsContainer]}>
              <View style={styles.nameCheckBxContainer}>
              </View>
              <View style={styles.personShareContainer}>
                <Text style={styles.columnLabelsStyle}>Share</Text>
              </View>
              <View style={styles.personDishAmountContainer}>
                <Text style={styles.columnLabelsStyle}>Cost</Text>
              </View>
            </View>

          <ScrollView contentContainerStyle={styles.dishSplitScrollView}>
            {
              people.map((personInfo) => {
                const personSplitInfo = this.state.currentDishSplit.find((item) => item.id == personInfo.id);
                const amountTextColorStyle = {};
                if(personSplitInfo && personSplitInfo.dishAmount){
                  amountTextColorStyle.color = '#276191'
                }
                return (
                <View style={styles.dishSplitPersonContainer} key={personInfo.id}>
                  <View style={styles.nameCheckBxContainer}>
                  <View style={styles.checkBoxContainer}>
                    <MKCheckbox
                      checked={personSplitInfo && personSplitInfo.selected ? personSplitInfo.selected : false}
                      editable={!disableSplitSection}
                      onCheckedChange={(obj) => {
                        if(!disableSplitSection){
                          this.onPersonSelectToggle(obj.checked, personInfo.id)
                        }
                      }}
                      fillColor={'#008C7D'}
                      borderOnColor={'#008C7D'}
                    />
                  </View>

                  <View style={styles.personNameContainer}>
                     <Text style={styles.personNameText}>
                       {personInfo.displayName}
                     </Text>
                  </View>
                </View>
                  <View style={styles.personShareContainer}>
                    <MKTextField
                       keyboardType={'numeric'}
                       value={personSplitInfo ? personSplitInfo.splitPortion.toString() : ''}
                       onChange={(event) => {this.onUserPortionChange(event, personSplitInfo.id )}}
                       style={{width:40}}
                       editable={!disableSplitSection && personSplitInfo && personSplitInfo.selected}
                       highlightColor={'#159688'}
                       textInputStyle={{ color: '#276191', textAlign: 'right'}}
                     />
                  </View>

                  <View style={styles.personDishAmountContainer}>
                    <AmountWithSymbol amount={personSplitInfo ? personSplitInfo.dishAmount : 0}
                      currencyContainerStyle={{paddingRight: 4}}
                      amountTextStyle ={[styles.personDishAmountText, amountTextColorStyle]}
                      currencySymbolStyle = {[styles.personDishAmountText , amountTextColorStyle]}
                      />
                  </View>

               </View>
                )
              })
          }
          </ScrollView>
        </View>
        </View>
    )
  }
}



DishSplitScene.propTypes = {
  billData: React.PropTypes.object,
  dishData: React.PropTypes.object,
  dishSplitActions: React.PropTypes.object,
  dishID: React.PropTypes.number,
  billRecordID: React.PropTypes.string,
  newItem: React.PropTypes.bool,
  navigator: React.PropTypes.object,
}
