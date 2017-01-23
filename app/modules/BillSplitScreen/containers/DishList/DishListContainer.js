import React from 'react';
import { View, ListView, Text, TouchableNativeFeedback, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';
import { Actions } from 'react-native-router-flux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AmountWithSymbol from '../../../../components/AmountWithSymbol';
import { ROUTES } from '../../../../constants';
import createBillPersistRecord from '../../../../utils/createBillPersistRecord';
import * as dishSplitActions from '../../../../actions/dishSplitActions';
import { persistBillRecordAction  } from '../../../../actions/billsActions'
import { styles, dishInfoStyle } from './styles';
import { getImageIconFromName } from '../../../../utils/getImageIconFromName'


class DishListContainer extends React.Component {
  constructor(){
    super();
    const ds = new ListView.DataSource ({
      rowHasChanged : (r1,r2) => r1 != r2, // TODO: need deep equals function here
    })
    this.state = {
      dataSource: ds
    }
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillMount(){
    if(this.props.billRecord){
      const { dishes } = this.props.billRecord;
      const { dishSplitMap } = this.props.splitRecord;
      const dishesArray = [];

      if(!isEmpty(dishes)){
        for (const dish in dishes){
          const tmpDishRecord = Object.assign({},dishes[dish]);
          tmpDishRecord.splitInfo = dishSplitMap[dishes[dish].dishID] ? dishSplitMap[dishes[dish].dishID]: {},
          dishesArray.push(tmpDishRecord)
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(dishesArray),
          loadingState: false,
          showDishSplits: true,
        })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    // code to update the dataSource for ListView when a dish has been added
    if((nextProps.splitRecord !== this.props.splitRecord) || (nextProps.billRecord !== this.props.billRecord)){
      const { dishes } = this.props.billRecord;
      const { dishSplitMap } = this.props.splitRecord;
      const dishesArray = [];
      dishes.map((dish) => {
        const tmpDishRecord = Object.assign({}, dish, {
          splitInfo : dishSplitMap[dish.dishID] ? dishSplitMap[dish.dishID]: {},
        })
        dishesArray.push(tmpDishRecord)
      })
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dishesArray),
        loadingState: false
      })
    }
  }

  onDishRecordPress(rowData){
    const { dishSplitActions, billRecordID } = this.props;
    Actions[ROUTES.dishSplitPage]({
      dishID: rowData.dishID,
      dishData: rowData,
      billData: this.props.billRecord,
      people: this.props.currentPeople,
      dishSplitActions,
      billRecordID,
    });
  }

  addNewItem(){
    const { dishSplitActions, billRecordID } = this.props;
    Actions[ROUTES.dishSplitPage]({
      newItem:true,
      billData: this.props.billRecord,
      people: this.props.currentPeople,
      dishSplitActions,
      billRecordID,
    })
  }

  saveBill(){
    // call util function which creats records to save to database from the props
    const actionParams = createBillPersistRecord(this.props);
    this.props.persistBillRecordAction(actionParams);
  }

  renderRow(rowData) {
    const imageIconSource = getImageIconFromName(rowData);
    const dishAmountString = parseFloat(rowData.pricePerItem) * parseFloat(rowData.count)
    console.log(dishAmountString);
    console.log('-------')

    return(
      <TouchableNativeFeedback onPress={this.onDishRecordPress.bind(this, rowData)}>
        <View style={dishInfoStyle.dishRowContainer}>
          <View style={dishInfoStyle.imageOuterView}>
            <View style={dishInfoStyle.imageContainer}>
              <Image source={imageIconSource} style={dishInfoStyle.dishItemImage}/>
            </View>
          </View>
          <View style={dishInfoStyle.dishItemInfoContainer}>
            <View style={dishInfoStyle.nameAmountContainer}>
              <View style={dishInfoStyle.nameContainer}>
                <Text style={dishInfoStyle.nameTextStyle}>
                  {rowData.dishName}
                </Text>
              </View>
              <View style={dishInfoStyle.amountContainer}>
                <AmountWithSymbol amount={dishAmountString}
                  currencyContainerStyle={{paddingRight: 3}}
                  amountTextStyle ={dishInfoStyle.amountTextStyle}
                  currencySymbolStyle = {dishInfoStyle.amountTextStyle}
                  />
              </View>

            </View>

          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render(){
    return(
      <View style={styles.container}>

        <View style={styles.addNewContainer}>
          <View style={styles.rowItemImageOuterView}>
            <View style={styles.rowItemImageContainer}>
            <MaterialIcons size={24} name={'add'} style={styles.addNewItemImage}/>
            </View>
          </View>
          <View style={styles.addNewItemTextContainer}>
              <Text style={styles.addNewItemText}>
                ADD ITEM
              </Text>
          </View>
        </View>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          style={styles.listContainer}
        />
      <View style={styles.saveButtonContainer}>
        <Text>
          Save
        </Text>
      </View>
      </View>

    )
  }
}

DishListContainer.propTypes = {
  splitRecord: React.PropTypes.object,
  billRecord: React.PropTypes.object,
  dishSplitActions: React.PropTypes.object,
  billRecordID:React.PropTypes.string,
  currentPeople: React.PropTypes.array,
  persistBillRecordAction: React.PropTypes.func,
}

const matchStateToProps = state => {
  return{
    billRecord: state.get('billSplitReducer').get('billRecord') ? state.get('billSplitReducer').get('billRecord').toJS() : null,
    splitRecord: state.get('billSplitReducer').get('splitRecord')? state.get('billSplitReducer').get('splitRecord').toJS() : null,
    currentPeople: state.get('billSplitReducer').get('currentPeople'),
  }
}

const matchDispatchToProps = dispatch => {
  return {
    persistBillRecordAction: bindActionCreators(persistBillRecordAction, dispatch),
    dishSplitActions: bindActionCreators(dishSplitActions,dispatch),
  }
}

export default connect(matchStateToProps, matchDispatchToProps)(DishListContainer)
