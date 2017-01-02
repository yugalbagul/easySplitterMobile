import React from 'react';
import { View, ListView, Text, TouchableHighlight, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';
import { styles } from './styles';
import { ROUTES } from '../../constants';
import * as dishSplitActions from '../../actions/dishSplitActions';
import { onBillNameChangeAction, onBillAmountChangeAction, persistBillRecordAction } from '../../actions/billsActions'

class BillSplitScene extends React.Component{
  constructor(){
    super()
    const ds = new ListView.DataSource ({
      rowHasChanged : (r1,r2) => r1 != r2, // TODO: need deep equals function here
    })
    this.state = {
      dataSource: ds,
      loadingState: true,
      showDishSplits: false,
    }
    this.renderRow = this.renderRow.bind(this);
    this.addNewItem = this.addNewItem.bind(this);
    this.saveBill = this.saveBill.bind(this);
    this.onBillNameChange = this.onBillNameChange.bind(this);
    this.onBillAmountChange = this.onBillAmountChange.bind(this);
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
      } else if (this.props.newBill){
        this.setState({
          loadingState: false,
        })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
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

  renderRow(rowData,sectionID,rowID) {
    return (
      <TouchableHighlight style={styles.item} onPress={this.onDishRecordPress.bind(this,rowData,rowID)}>
        <View>
          <Text>{rowData.dishName}</Text>
          <Text>{rowData.pricePerItem}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  onDishRecordPress(rowData){
    const { dishSplitActions, billRecordID } = this.props;
    this.props.navigator.push({
      title:'Dish Split Page',
      routeName: ROUTES.dishSplitPage,
      dishID: rowData.dishID,
      dishData: rowData,
      billData: this.props.billRecord,
      dishSplitActions,
      billRecordID,
      navigator: this.props.navigator,
    });
  }

  addNewItem(){
    const { dishSplitActions, billRecordID } = this.props;
    this.props.navigator.push({
      title:'Dish Split Page',
      routeName: ROUTES.dishSplitPage,
      newItem:true,
      billData: this.props.billRecord,
      dishSplitActions,
      billRecordID,
      navigator: this.props.navigator,
    })
  }

  saveBill(){
    const { billRecord, splitRecord, currentBillName, currentBillAmount } = this.props;
    const tempBillRecord = Object.assign({}, billRecord, { billName: currentBillName, totalBillAmount: parseFloat(currentBillAmount) } );
    this.props.persistBillRecordAction(tempBillRecord, splitRecord);
  }

  onBillNameChange(event) {
    this.props.onBillNameChangeAction(event.nativeEvent.text, this.props.billRecordID)
  }
  onBillAmountChange(event) {
    const newText = event.nativeEvent.text;
    const isNumber = /^\d+(?:\.)?(?:\d+)?$/.test(newText);
    if(isNumber || !newText){
      this.props.onBillAmountChangeAction(newText, this.props.billRecordID)
    }
  }

  render() {
    const { splitRecord, newBill, currentBillName, currentBillAmount } = this.props;
    const showActionContainer = (!currentBillAmount && newBill) ? false : true;


    return(

      <View style={styles.container}>
        {!this.state.loadingState ?
        <View style={styles.billInfo}>
          <View style={styles.billInfoName}>
            <TextInput
              placeholder={'Enter Bill name you whore'}
              style={styles.billInfoBillName}
              value={currentBillName}
              autoCorrect = {false}
              onChange={(event) => {this.onBillNameChange(event)}}
            />
          </View>
          <View style={styles.billAmountInfo}>
            <TextInput
              keyboardType={'numeric'}
              placeholder={'Enter Amount Bitch'}
              style={styles.currentBillAmount}
              value={currentBillAmount.toString()}
              onChange={(event) => {this.onBillAmountChange(event)}}
            />
            <Text>Amount not split :
                <Text style={{color:'red'}}>
                  {parseFloat(currentBillAmount)  - splitRecord.totalAmountSplit}
                </Text>
              </Text>
              <TouchableOpacity onPress={this.saveBill}>
                <Text>Save</Text>
              </TouchableOpacity>
          </View>
        </View> : null }

        {!this.state.loadingState &&   showActionContainer?
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={this.addNewItem}>
              <Text style={styles.addNewItemText}>New Item</Text>
          </TouchableOpacity>
        </View> : null }
        {!this.state.loadingState && this.state.showDishSplits?
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          style={styles.list}
        /> : null
      }

    </View>

    )
  }
}

BillSplitScene.propTypes = {
  splitRecord: React.PropTypes.object,
  billRecord: React.PropTypes.object,
  dishSplitActions: React.PropTypes.object,
  navigator: React.PropTypes.object,
  billRecordID:React.PropTypes.string,
  newBill: React.PropTypes.bool,
  onBillNameChangeAction: React.PropTypes.func,
  onBillAmountChangeAction: React.PropTypes.func,
  currentBillName: React.PropTypes.string,
  currentBillAmount: React.PropTypes.string,
}

const matchStateToProps = (state, props) => {
  const billID = props.newBill ? state.getIn(['appStateReducer', 'newBillID']): state.getIn(['appStateReducer', 'billIdUnderEdit']);
  return {
    billRecord: state.get('appStateReducer').get('billRecord') ? state.get('appStateReducer').get('billRecord').toJS() : null,
    splitRecord: state.get('appStateReducer').get('splitRecord')? state.get('appStateReducer').get('splitRecord').toJS() : null,
    currentBillName: state.get('appStateReducer').get('currentBillName'),
    currentBillAmount: state.get('appStateReducer').get('currentBillAmount'),
    billRecordID: billID,
  }
}

const matchDispatchToProps = (dispatch) => {
  return{
    dishSplitActions: bindActionCreators(dishSplitActions,dispatch),
    onBillNameChangeAction: bindActionCreators(onBillNameChangeAction, dispatch),
    onBillAmountChangeAction: bindActionCreators(onBillAmountChangeAction, dispatch),
    persistBillRecordAction: bindActionCreators(persistBillRecordAction, dispatch)
  }
}

export default connect(matchStateToProps, matchDispatchToProps)(BillSplitScene);
