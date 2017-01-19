import React from 'react';
import { View, ListView, Text, TouchableNativeFeedback,
  TouchableOpacity, ActivityIndicator,Image,
  StatusBar, ToolbarAndroid, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEqual } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux'
import { ROUTES } from '../../constants';
import { DateComponent } from '../../components/DateComponent'
import { styles, billCardStyle } from './styles';
import { addNewBillAction, setBillForEdit, getUserBillsAction, getUserFriendsAction } from '../../actions/billsActions'

const calculatePendingBarWidth = () => {
  const { width: screenWidth } = Dimensions.get('window');
  const userOwesAmount = 230;
  const userGetBackAmount = 1230;
  const totalTally = userOwesAmount + userGetBackAmount;

  const oweWidth = (userOwesAmount/totalTally) * screenWidth;
  const getBackWidth = (userGetBackAmount/totalTally) * screenWidth;
  return{
    oweWidth,
    getBackWidth
  }
}

class HomeScene extends React.Component {
  constructor(){
    super()
    const ds = new ListView.DataSource ({
      rowHasChanged : (r1,r2) => r1 != r2, // TODO: need deep equals function here
    })
    this.state = {
      dataSource: ds,
    }
    this.renderRow = this.renderRow.bind(this);
    this.addNewBill = this.addNewBill.bind(this);
  }

  componentWillMount(){

    if(this.props.billRecords){
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.props.billRecords)
      })
    }
  }

  componentDidMount() {
    const { props: { currentUser, getUserBillsAction, getUserFriendsAction } } = this
    if(currentUser){
      getUserBillsAction(currentUser.id);
      getUserFriendsAction(currentUser.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if( !isEqual(nextProps.billRecords,this.props.billRecords)){
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.billRecords)
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { props: { currentUser, getUserBillsAction, getUserFriendsAction } } = this
    if(currentUser && currentUser.id !== prevProps.currentUser.id){
      getUserBillsAction(currentUser.id);
      getUserFriendsAction(currentUser.id);
    }
  }

  onBillRecordPress(rowData){
    // TODO add strict check on all things
    const self = this;
    const splitRecord = self.props.splitRecords[rowData.id];
    const billUsers = [];
    const { userRecords } = self.props;
    const billPeopleIds = Array.from(rowData.people);
    billPeopleIds.map((item) => {
      billUsers.push(userRecords[item.id]);
    })
    this.props.setBillForEdit(rowData, splitRecord, billUsers, userRecords);
    Actions[ROUTES.billSplitPage]()
  }

  renderRow(rowData) {
    let amountYouOwe = 0;
    let isPaidByUser = false;
    let amountPaidByYou = 0;
    let amountToDisplay = 0;
    const { currentUser } = this.props
    const splitRecord = this.props.splitRecords[rowData.id];
    if(splitRecord && splitRecord.amountPerPerson){
      const temp = splitRecord.amountPerPerson[currentUser.id].billAmountToPay;
      amountYouOwe = temp ? temp : 0;
    }
    if(rowData.paidBy){
      if(rowData.paidBy === currentUser.id){
        isPaidByUser = true;
        amountPaidByYou = rowData.totalBillAmount;
      } else if(rowData.paidBy === 'multiple'){
        const tempUserPayRecord = rowData.multiplePaideByRecord.find((item) => item.id === currentUser.id);
        if(tempUserPayRecord){
          isPaidByUser = true;
          amountPaidByYou = tempUserPayRecord.amountPaid;
        }
      }
    }
    const textToDisplay = (isPaidByUser && amountPaidByYou > amountYouOwe) ? 'You Get Back' : 'You Owe';
    amountToDisplay = (amountPaidByYou >= amountYouOwe )? amountPaidByYou - amountYouOwe : amountYouOwe - amountPaidByYou;
    const amountColor = {
      color: amountPaidByYou >= amountYouOwe ? 'green' : '#E76060',
    }
    return (
      <TouchableNativeFeedback onPress={this.onBillRecordPress.bind(this, rowData)}
        background={TouchableNativeFeedback.Ripple('grey')}
      >
        <View style={billCardStyle.outerContainer}>
          <View style={billCardStyle.billCardCol1}>
            <Text style= {billCardStyle.billNameStyle}>{rowData.billName}</Text>
            <DateComponent date = {new Date(rowData.billDate)} textStyle={billCardStyle.dateStyle}/>
          </View>
          <View style={billCardStyle.billCardCol2}>
            <Text style= {billCardStyle.smallTextStyle}>Total Bill</Text>
            <Text style= {billCardStyle.totalBillAmountStyle}>Rs.{rowData.totalBillAmount}</Text>
          </View>
          <View style={billCardStyle.billCardCol3}>
            <Text style= {billCardStyle.smallTextStyle}>{textToDisplay}</Text>
            <Text style= {[billCardStyle.yourAmountStyle, amountColor]}>Rs.{amountToDisplay}</Text>

          </View>
      </View>
      </TouchableNativeFeedback>
    )
  }

  addNewBill(){
    this.props.addNewBillAction();
    Actions[ROUTES.billSplitPage]();
  }


  render() {
    const { props: { loadingFlag, currentUser } } = this
    const pendingBarWidths = calculatePendingBarWidth();
    return(
      <View style={styles.container}>
        {loadingFlag ?
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              animating={true}
              style={[styles.loadingIndicator, {height: 80}]}
              size="large"
              />
          </View>
            :
          <View style={styles.sceneContent}>
            <StatusBar
              animated= {true}
              backgroundColor= {'#15435B'}
            />
          <ToolbarAndroid
            title= 'Home'
            style= {{
              backgroundColor: '#15435B',
              height: 56,
              elevation: 10
            }}
            titleColor= '#FFFFFF'
          />
            <LinearGradient
              colors={[ '#15435B', '#1E556E','#2F7894']}
              style={styles.gradientContainer}
              start={{x: 0.0, y: 0}} end={{x: 0.5, y: 0}}
              locations={[0,0.1,1]}
            >
              <View style={styles.userThumbnailContainer}>
                <Image source={{uri: currentUser.photoURL}} style={styles.userThumbnail}/>
                <Text style={{ color: 'white', paddingLeft: 5 }}>Total Balance</Text>
              </View>
              <View style={styles.personPendingAmount}>
                <Text style={{color: '#FFE700'}}> {'Rs.1000'} </Text>
              </View>
            </LinearGradient>

            <View style={styles.currentUserPendingBar}>
              <View style={{ backgroundColor: '#E76060', paddingVertical: 5,width: pendingBarWidths.oweWidth, alignItems:'center' }}>
                <Text  style={{ color: 'white'}}> {'Rs.230'}</Text>
              </View>
              <View style={{ backgroundColor: '#32AA9F', paddingVertical: 5, width: pendingBarWidths.getBackWidth, alignItems:'center' }}>
                <Text style={{ color: 'white'}}>{'Rs.1230'} </Text>
              </View>
            </View>

            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}
              style={styles.list}
            />
          </View>
        }

    </View>
    )
  }
}

HomeScene.propTypes = {
  billRecords: React.PropTypes.object,
  currentUser: React.PropTypes.object,
  addNewBillAction: React.PropTypes.func,
  setBillForEdit: React.PropTypes.func,
  loadingFlag: React.PropTypes.bool,
  getUserBillsAction: React.PropTypes.func,
  getUserFriendsAction: React.PropTypes.func
}

const matchStateToProps = (state) => {
  const billRecords = state.get('billRecordsReducer') && state.get('billRecordsReducer').toJS ? state.get('billRecordsReducer').toJS() : null;
  const splitRecords = state.get('splitRecordsReducer').toJS();
  const currentUser = state.get('loginReducer').get('currentUser') ? state.get('loginReducer').get('currentUser').toJS() : null;
  const loadingFlag = state.get('appStateReducer').get('userBillsLoading') || state.get('appStateReducer').get('userFriendsLoading');
  const userRecords = state.get('userRecordsReducer') && state.get('userRecordsReducer').toJS ? state.get('userRecordsReducer').toJS() : null;
  return {
    billRecords,
    splitRecords,
    currentUser,
    loadingFlag,
    userRecords
  }
}

const matchDispatchToProps = (dispatch) => {
  return{
    addNewBillAction: bindActionCreators(addNewBillAction, dispatch),
    setBillForEdit: bindActionCreators(setBillForEdit, dispatch),
    getUserBillsAction: bindActionCreators(getUserBillsAction, dispatch),
    getUserFriendsAction: bindActionCreators(getUserFriendsAction, dispatch)
  }
}

export default connect(matchStateToProps, matchDispatchToProps)(HomeScene);
