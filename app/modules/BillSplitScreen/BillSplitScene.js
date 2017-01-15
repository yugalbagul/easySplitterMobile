import React from 'react';
import { View, ListView, Text, TouchableHighlight, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';
import { styles } from './styles';
import PaidByModal from './PaidByModal';
import MultiplePaidByModal from './MultiplePaidByModal';
import { ROUTES } from '../../constants';
import * as dishSplitActions from '../../actions/dishSplitActions';
import { onBillNameChangeAction, onBillAmountChangeAction, persistBillRecordAction,setPaidByAction, setPeopleInvovledModalAction  } from '../../actions/billsActions'
import PeopleInvolvedModal from './PeopleInvolvedModal';

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
    this.togglePaidByModal = this.togglePaidByModal.bind(this);
    this.togglePeopleInvolvedModal = this.togglePeopleInvolvedModal.bind(this);
    this.cancelBillSplit = this.cancelBillSplit.bind(this);
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
      people: this.props.currentPeople,
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
      people: this.props.currentPeople,
      dishSplitActions,
      billRecordID,
      navigator: this.props.navigator,
    })
  }

  saveBill(){
    const { billRecord, splitRecord, currentBillName, currentBillAmount, currentPeople, navigator, currentUser, paidBy, newBill, multiplePaideByRecord } = this.props;
    const billPeople = [];
    currentPeople.map(item => {
      billPeople.push({ id: item.id });
    })
    const updateObject = {
      billName: currentBillName,
      totalBillAmount: parseFloat(currentBillAmount),
      people: billPeople,
      paidBy: paidBy
    }
    if(!isEmpty(multiplePaideByRecord)){
      updateObject.multiplePaideByRecord = multiplePaideByRecord;
    }
    const tempBillRecord = Object.assign({}, billRecord, updateObject);
    const actionParams = {
      billRecord: tempBillRecord,
      splitRecord,
      newBill,
      currentUser,
      navigator
    }
    this.props.persistBillRecordAction(actionParams);
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

  togglePeopleInvolvedModal() {
    const { props: { setPeopleInvovledModalAction } } = this
    setPeopleInvovledModalAction(true);
  }

  cancelBillSplit(){
    this.props.navigator.pop();
  }

  render() {
    const { splitRecord, newBill, currentBillName, currentBillAmount,
      currentPeople, paidBy, showPaidByModal, showMultiplePaidByModal,
      multiplePaideByRecord, showPeopleInvovledModal, allUserRecords, currentUser } = this.props;
    const showActionContainer = (!currentBillAmount && newBill) ? false : true;
    const peopleArray = Array.from(currentPeople);
    const isPaidBySet =  paidBy? true : false;
    const isPaidByMultiple = paidBy === 'multiple';
    let paidByText = 'Choose';
    peopleArray.push({ id: 'multiple', displayName: 'Multiple' })
    if(isPaidBySet && !isPaidByMultiple){
      const paidByPerson = peopleArray.find((person) => person.id === paidBy);
      paidByText = paidByPerson.displayName;
    } else if (isPaidByMultiple) {
      paidByText = 'Multiple'
    }
    return(

      <View style={styles.container}>
        {!this.state.loadingState ?
        <View style={styles.billInfo}>
          <TouchableOpacity onPress={this.cancelBillSplit}>
                <Text>Close</Text>
          </TouchableOpacity>
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

          <TouchableOpacity onPress={this.togglePeopleInvolvedModal}>
                <Text>Set People Involved</Text>
          </TouchableOpacity>

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
        {showPeopleInvovledModal ?
          <PeopleInvolvedModal
             showModal={ showPeopleInvovledModal }
             currentPeople={ currentPeople }
             allUserRecords= { allUserRecords }
             currentUser = { currentUser }
          /> : null
        }
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
  billRecordID:React.PropTypes.string,
  newBill: React.PropTypes.bool,
  onBillNameChangeAction: React.PropTypes.func,
  onBillAmountChangeAction: React.PropTypes.func,
  currentBillName: React.PropTypes.string,
  currentBillAmount: React.PropTypes.number,
  currentPeople: React.PropTypes.array,
  setPaidByAction: React.PropTypes.func,
  allUserRecords: React.PropTypes.object,
  currentUser: React.PropTypes.object
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
    showPeopleInvovledModal: state.get('billSplitReducer').get('showPeopleInvovledModal'),
    multiplePaideByRecord: state.get('billSplitReducer').get('multiplePaideByRecord'),
    newBill: state.get('billSplitReducer').get('newBill'),
    billRecordID: billID,
    currentUser: state.get('loginReducer').get('currentUser') ? state.get('loginReducer').get('currentUser').toJS() : null,
    allUserRecords : state.get('userRecordsReducer') && state.get('userRecordsReducer').toJS ? state.get('userRecordsReducer').toJS() : null
  }
}

const matchDispatchToProps = (dispatch) => {
  return{
    dishSplitActions: bindActionCreators(dishSplitActions,dispatch),
    onBillNameChangeAction: bindActionCreators(onBillNameChangeAction, dispatch),
    onBillAmountChangeAction: bindActionCreators(onBillAmountChangeAction, dispatch),
    persistBillRecordAction: bindActionCreators(persistBillRecordAction, dispatch),
    setPaidByAction: bindActionCreators(setPaidByAction,dispatch),
    setPeopleInvovledModalAction: bindActionCreators(setPeopleInvovledModalAction, dispatch),
  }
}

export default connect(matchStateToProps, matchDispatchToProps)(BillSplitScene);
