import React from 'react';
import { View, ListView, Text, TouchableHighlight, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';
import { styles } from './styles';
import { ROUTES } from '../../constants';
import * as dishSplitActions from '../../actions/dishSplitActions';
import { onBillNameChangeAction, onBillAmountChangeAction } from '../../actions/billsActions'

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
      const { dishes, billName, totalBillAmount } = this.props.billRecord;
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
          currentBillName: billName,
          currentBillAmount:totalBillAmount,
        })
      } else if (this.props.newBill){
        this.setState({
          currentBillName: billName,
          currentBillAmount:totalBillAmount,
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
    const { billRecord, splitRecord } = this.props;
    console.log('-------------');
    console.log(billRecord);
    console.log('-------------');
    console.log(splitRecord);
  }

  onBillNameChange(event) {
    this.props.onBillNameChangeAction(event.nativeEvent.text, this.props.billRecordID)
  }

  onBillAmountChange(event) {
    this.props.onBillAmountChangeAction(parseFloat(event.nativeEvent.text), this.props.billRecordID)
  }

  render() {
    const { splitRecord, newBill, billRecord } = this.props;
    console.log("re render");
    const { billName, totalBillAmount } = billRecord;
    const showActionContainer = (!totalBillAmount && newBill) ? false : true;


    return(

      <View style={styles.container}>
        {!this.state.loadingState ?
        <View style={styles.billInfo}>
          <View style={styles.billInfoName}>
            <TextInput
              placeholder={'Enter Bill name you whore'}
              style={styles.billInfoBillName}
              value={billName}
              autoCorrect = {false}
              onChange={(event) => {this.onBillNameChange(event)}}
            />
          </View>
          <View style={styles.billAmountInfo}>
            <TextInput
              keyboardType={'numeric'}
              placeholder={'Enter Amount Bitch'}
              style={styles.currentBillAmount}
              value={totalBillAmount.toString()}
              onChange={(event) => {this.onBillAmountChange(event)}}
            />
            <Text>Amount not split :
                <Text style={{color:'red'}}>
                  {parseFloat(totalBillAmount)  - splitRecord.totalAmountSplit}
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
}

const matchStateToProps = (state, props) => {
  const billID = props.newBill ? state.getIn(['appStateReducer', 'newBillID']): state.getIn(['appStateReducer', 'billIdUnderEdit']);
  return {
    billRecord: state.get('appStateReducer').get('billRecord') ? state.get('appStateReducer').get('billRecord').toJS() : null,
    splitRecord: state.get('appStateReducer').get('splitRecord')? state.get('appStateReducer').get('splitRecord').toJS() : null,
    billRecordID: billID,
  }
}

const matchDispatchToProps = (dispatch) => {
  return{
    dishSplitActions: bindActionCreators(dishSplitActions,dispatch),
    onBillNameChangeAction: bindActionCreators(onBillNameChangeAction, dispatch),
    onBillAmountChangeAction: bindActionCreators(onBillAmountChangeAction, dispatch)
  }
}

export default connect(matchStateToProps, matchDispatchToProps)(BillSplitScene);
