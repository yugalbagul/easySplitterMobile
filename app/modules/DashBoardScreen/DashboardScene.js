import React from 'react';
import { View, ListView, Text, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEqual } from 'lodash';
import { ROUTES } from '../../constants';
import { styles } from './styles';
import { addNewBillAction, setBillForEdit, getUserBillsAction } from '../../actions/billsActions'

class DashboardScene extends React.Component {
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
    const { props: { currentUser, getUserBillsAction } } = this
    if(currentUser){
      console.log('doing bills fetch');
      getUserBillsAction(currentUser.id);
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
    const { props: { currentUser, getUserBillsAction } } = this
    if(currentUser && currentUser.id !== prevProps.currentUser.id){
      getUserBillsAction(currentUser.id);
    }
  }

  onBillRecordPress(rowData){
    const self = this;
    const splitRecord = self.props.splitRecords[rowData.id];
    this.props.setBillForEdit(rowData, splitRecord);
    this.props.navigator.push({title: 'Bill Split Page', routeName: ROUTES.billSplitPage})
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight style={styles.item} onPress={this.onBillRecordPress.bind(this, rowData)}>
        <View >
          <Text>{rowData.billName}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  addNewBill(){
    this.props.addNewBillAction();
    this.props.navigator.push({title: 'Bill Split Page', newBill: true, routeName: ROUTES.billSplitPage})
  }


  render() {
    const { props: { loadingFlag } } = this
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
            <View style={styles.personInfo}>
              <View style={styles.personInfoName}>

                <Text style={styles.personInfoUserName}>Yugal Bagul</Text>
              </View>
              <View style={styles.personAmountInfo}>
                <Text>You owe :
                  <Text style={{color:'red'}}>
                    200
                  </Text>
                </Text>
                <Text>You receive :
                  <Text style={{color:'green'}}>
                    100
                  </Text>
                </Text>
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity onPress={this.addNewBill}>
                  <Text style={styles.addNewItemText}>New Item</Text>
              </TouchableOpacity>
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

DashboardScene.propTypes = {
  billRecords: React.PropTypes.object,
  navigator: React.PropTypes.object,
  currentUser: React.PropTypes.object,
  addNewBillAction: React.PropTypes.func,
  setBillForEdit: React.PropTypes.func,
  loadingFlag: React.PropTypes.bool,
  getUserBillsAction: React.PropTypes.func
}

const matchStateToProps = (state) => {
  const billRecords = state.get('billRecordsReducer') && state.get('billRecordsReducer').toJS ? state.get('billRecordsReducer').toJS() : [];
  const splitRecords = state.get('splitRecordsReducer').toJS();
  const currentUser = state.get('loginReducer').get('currentUser') ? state.get('loginReducer').get('currentUser').toJS() : null;
  const loadingFlag = state.get('appStateReducer').get('dashBoardLoading')
  return {
    billRecords,
    splitRecords,
    currentUser,
    loadingFlag
  }
}

const matchDispatchToProps = (dispatch) => {
  return{
    addNewBillAction: bindActionCreators(addNewBillAction, dispatch),
    setBillForEdit: bindActionCreators(setBillForEdit, dispatch),
    getUserBillsAction: bindActionCreators(getUserBillsAction, dispatch),
  }
}

export default connect(matchStateToProps, matchDispatchToProps)(DashboardScene);
