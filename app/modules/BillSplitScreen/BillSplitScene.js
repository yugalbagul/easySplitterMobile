import React from 'react';
import { View, ListView, Text, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';
import { Actions } from 'react-native-router-flux';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import BillBasicInfoContainer from './containers/BillBasicInfo/BillBasicInfoContainer';
import { ROUTES } from '../../constants';
import DishRecordRow from './components/DishRecordRow'
import * as dishSplitActions from '../../actions/dishSplitActions';
import createBillPersistRecord from '../../utils/createBillPersistRecord';
import { persistBillRecordAction, cancelBillSplitAction  } from '../../actions/billsActions'
import PeopleInvolvedContainer from './containers/PeopleInvolved/PeopleInvolvedContainer';
import PaidByContainer from './containers/PaidBy/PaidByContainer';



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
      billDate: null
    }
    this.renderRow = this.renderRow.bind(this);
    this.addNewItem = this.addNewItem.bind(this);
    this.saveBill = this.saveBill.bind(this);
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
        })
      } else if (this.props.newBill){
        this.setState({
          loadingState: false,
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

  renderRow(rowData) {
    return (
      <DishRecordRow onDishRecordPress = {this.onDishRecordPress} rowData={rowData}/>
    )
  }

  onDishRecordPress(rowData){
    const self = this;
    const { dishSplitActions, billRecordID } = self.props;
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


  cancelBillSplit(){
    this.props.cancelBillSplitAction();
    Actions.pop();
  }

  render() {
    const { newBill, currentPeople } = this.props;
    //const showActionContainer = (!currentBillAmount && newBill) ? false : true;

    return(

      <View style={styles.container}>
        <Icons.ToolbarAndroid
          title= 'Add Bill'
          style= {{
            backgroundColor: '#18435A',
            height: 56,
            elevation: 10
          }}
          navIconName='close'
          titleColor= '#FFFFFF'
          onIconClicked={this.cancelBillSplit}
        />
        <View style={styles.billInfo}>

          <BillBasicInfoContainer />

          <PeopleInvolvedContainer />

          <PaidByContainer />

        </View>

        {!this.state.loadingState && this.state.showDishSplits ?
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
  billRecordID:React.PropTypes.string,
  newBill: React.PropTypes.bool,
  currentPeople: React.PropTypes.array,
  persistBillRecordAction: React.PropTypes.func,
}

const matchStateToProps = (state, props) => {
  const billID = props.newBill ? state.getIn(['billSplitReducer', 'newBillID']): state.getIn(['billSplitReducer', 'billIdUnderEdit']);
  return {
    billRecord: state.get('billSplitReducer').get('billRecord') ? state.get('billSplitReducer').get('billRecord').toJS() : null,
    splitRecord: state.get('billSplitReducer').get('splitRecord')? state.get('billSplitReducer').get('splitRecord').toJS() : null,
    currentPeople: state.get('billSplitReducer').get('currentPeople'),
    newBill: state.get('billSplitReducer').get('newBill'),
    billRecordID: billID,
  }
}

const matchDispatchToProps = (dispatch) => {
  return{
    dishSplitActions: bindActionCreators(dishSplitActions,dispatch),
    persistBillRecordAction: bindActionCreators(persistBillRecordAction, dispatch),
    cancelBillSplitAction: bindActionCreators(cancelBillSplitAction, dispatch)
  }
}

export default connect(matchStateToProps, matchDispatchToProps)(BillSplitScene);
