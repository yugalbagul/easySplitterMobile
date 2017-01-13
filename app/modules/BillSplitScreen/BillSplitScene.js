import React from 'react';
import { View, ListView, Text, TouchableHighlight, TouchableOpacity, TextInput, Modal } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';
import { styles } from './styles';
import PaidByModal from './PaidByModal';
import MultiplePaidByModal from './MultiplePaidByModal';
import { ROUTES } from '../../constants';
import * as dishSplitActions from '../../actions/dishSplitActions';
import { onBillNameChangeAction, onBillAmountChangeAction, persistBillRecordAction, setPaidByAction } from '../../actions/billsActions'


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
      showPaidByModal: false,
    }
    this.renderRow = this.renderRow.bind(this);
    this.addNewItem = this.addNewItem.bind(this);
    this.saveBill = this.saveBill.bind(this);
    this.onBillNameChange = this.onBillNameChange.bind(this);
    this.onBillAmountChange = this.onBillAmountChange.bind(this);
    this.togglePaidByModal = this.togglePaidByModal.bind(this);
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
          paidBy: 1,
        })
      } else if (this.props.newBill){
        this.setState({
          loadingState: false,
          paidBy: 1,
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
    const { billRecord, splitRecord, currentBillName, currentBillAmount, currentPeople, paidBy, multiplePaideByRecord } = this.props;
    const updateObject = {
      billName: currentBillName,
      totalBillAmount: parseFloat(currentBillAmount),
      people: currentPeople,
      paidBy: paidBy
    }
    if(!isEmpty(multiplePaideByRecord)){
      updateObject.multiplePaideByRecord = multiplePaideByRecord;
    }
    const tempBillRecord = Object.assign({}, billRecord, updateObject);
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

  togglePaidByModal() {
    const { props: { setPaidByAction } } = this
    const paidByActionObject = {
      togglePaidByModal: true,
    }
    setPaidByAction(paidByActionObject);
  }

  render() {
    const { splitRecord, newBill, currentBillName, currentBillAmount,
      currentPeople, paidBy, showPaidByModal, showMultiplePaidByModal,
      multiplePaideByRecord } = this.props;
    const showActionContainer = (!currentBillAmount && newBill) ? false : true;
    const peopleArray = Array.from(currentPeople);
    const isPaidBySet =  paidBy? true : false;
    const isPaidByMultiple = paidBy === 'multiple';
    let paidByText = 'Choose';
    peopleArray.push({ id: 'multiple', name: 'Multiple' })
    if(isPaidBySet && !isPaidByMultiple){
      const paidByPerson = peopleArray.find((person) => person.id === paidBy);
      paidByText = paidByPerson.name;
    } else if (isPaidByMultiple) {
      paidByText = 'Multiple'
    }
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

          <TouchableOpacity onPress={this.togglePaidByModal}>
              <Text>PaidBy : {paidByText}</Text>
            </TouchableOpacity>

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
        {showPaidByModal ?
          <PaidByModal
            showPaidByModal={showPaidByModal}
            people={peopleArray}
            setPaidByAction= {this.props.setPaidByAction}
          /> : null}
        { showMultiplePaidByModal ?
        <MultiplePaidByModal
           showModal={ showMultiplePaidByModal }
           people={ currentPeople }
           setPaidByAction={this.props.setPaidByAction}
           currentBillAmount={currentBillAmount}
           multiplePaideByRecord={multiplePaideByRecord}
        /> : null }

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
  billRecordID:React.PropTypes.number,
  newBill: React.PropTypes.bool,
  onBillNameChangeAction: React.PropTypes.func,
  onBillAmountChangeAction: React.PropTypes.func,
  currentBillName: React.PropTypes.string,
  currentBillAmount: React.PropTypes.number,
  currentPeople: React.PropTypes.array,
  setPaidByAction: React.PropTypes.func,
}

const matchStateToProps = (state, props) => {
  const billID = props.newBill ? state.getIn(['billSplitReducer', 'newBillID']): state.getIn(['billSplitReducer', 'billIdUnderEdit']);
  return {
    billRecord: state.get('billSplitReducer').get('billRecord') ? state.get('billSplitReducer').get('billRecord').toJS() : null,
    splitRecord: state.get('billSplitReducer').get('splitRecord')? state.get('billSplitReducer').get('splitRecord').toJS() : null,
    currentBillName: state.get('billSplitReducer').get('currentBillName'),
    currentBillAmount: state.get('billSplitReducer').get('currentBillAmount'),
    currentPeople: state.get('billSplitReducer').get('currentPeople'),
    paidBy: state.get('billSplitReducer').get('paidBy'),
    showPaidByModal: state.get('billSplitReducer').get('showPaidByModal'),
    showMultiplePaidByModal: state.get('billSplitReducer').get('showMultiplePaidByModal'),
    multiplePaideByRecord: state.get('billSplitReducer').get('multiplePaideByRecord'),
    billRecordID: billID,
  }
}

const matchDispatchToProps = (dispatch) => {
  return{
    dishSplitActions: bindActionCreators(dishSplitActions,dispatch),
    onBillNameChangeAction: bindActionCreators(onBillNameChangeAction, dispatch),
    onBillAmountChangeAction: bindActionCreators(onBillAmountChangeAction, dispatch),
    persistBillRecordAction: bindActionCreators(persistBillRecordAction, dispatch),
    setPaidByAction: bindActionCreators(setPaidByAction,dispatch)
  }
}

export default connect(matchStateToProps, matchDispatchToProps)(BillSplitScene);
