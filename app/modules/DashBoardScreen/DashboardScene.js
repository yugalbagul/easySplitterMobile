import React from 'react';
import { View, ListView, StyleSheet, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ROUTES } from '../../constants';
import { addNewBillAction, setBillForEdit } from '../../actions/billsActions'

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

  componentWillReceiveProps(nextProps) {
    if(nextProps.billRecords != this.props.billRecords){
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.billRecords)
      })
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
          <Text>{rowData.restaurantName}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  addNewBill(){
    this.props.addNewBillAction();
    this.props.navigator.push({title: 'Bill Split Page', newBill: true, routeName: ROUTES.billSplitPage})
  }


  render() {
    return(
      <View style={styles.container}>
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
    )
  }
}

DashboardScene.propTypes = {
  billRecords: React.PropTypes.object,
  navigator: React.PropTypes.object,
  addNewBillAction: React.PropTypes.func,
  setBillForEdit: React.PropTypes.func,
}

const matchStateToProps = (state) => {
  const billRecords = state.get('billRecordsReducer') && state.get('billRecordsReducer').toJS ? state.get('billRecordsReducer').toJS() : [];
  const splitRecords = state.get('splitRecordsReducer').toJS();
  return {
    billRecords,
    splitRecords
  }
}

const matchDispatchToProps = (dispatch) => {
  return{
    addNewBillAction: bindActionCreators(addNewBillAction, dispatch),
    setBillForEdit: bindActionCreators(setBillForEdit, dispatch),
  }
}

export default connect(matchStateToProps, matchDispatchToProps)(DashboardScene);

const styles  = StyleSheet.create({
  container: {
    flex:1,
  },
  // Bill info styles
  personInfo:{
    borderBottomWidth: 1,
    padding:10
  },
  personInfoName: {
  },
  personInfoUserName:{
    fontSize: 20,
  },

  //action container styles
  actionsContainer:{
    height:30,
    flexDirection:'row',
    justifyContent:'flex-end',
    borderBottomWidth:1,
    padding: 5

  },
  addNewItemText: {
    color:'blue'
  },


  //  List view style
  list : {
    flex: 1
  },
  item : {
    flex:1,
    minHeight: 50,
    marginBottom: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black'

  }
})
