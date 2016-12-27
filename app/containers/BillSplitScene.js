import React from 'react';
import { View, ListView, StyleSheet, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ROUTES } from '../constants'
import * as dishSplitActions from '../actions/dishSplitActions';

class BillSplitScene extends React.Component {
  constructor(){
    super()
    const ds = new ListView.DataSource ({
      rowHasChanged : (r1,r2) => r1 != r2, // TODO: need deep equals function here
    })
    this.state = {
      dataSource: ds,
      editBillName: false,
      editBillAmount: false,
      editRestaurantName: false,
    }
    this.renderRow = this.renderRow.bind(this);
    this.addNewItem = this.addNewItem.bind(this);
  }

  componentWillMount(){
    if(this.props.billRecord){
      const { dishes } = this.props.billRecord;
      const { dishSplitMap } = this.props.splitRecord;
      const dishesArray = [];
      for (const dish in dishes){
        const tmpDishRecord = dishes[dish];
        tmpDishRecord.splitInfo = dishSplitMap[dishes[dish].dishID] ? dishSplitMap[dishes[dish].dishID]: {},
        dishesArray.push(tmpDishRecord)
      }

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dishesArray),
      })
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
    const { dishSplitActions, billRecordIndex } = this.props;
    this.props.navigator.push({
      title:'Dish Split Page',
      routeName: ROUTES.dishSplitPage,
      dishID: rowData.dishID,
      dishData: rowData,
      billData: this.props.billRecord,
      dishSplitActions,
      billRecordIndex,
      navigator: this.props.navigator,
    });
  }

  addNewItem(){
    const { dishSplitActions, billRecordIndex } = this.props;
    this.props.navigator.push({
      title:'Dish Split Page',
      routeName: ROUTES.dishSplitPage,
      newItem:true,
      billData: this.props.billRecord,
      dishSplitActions,
      billRecordIndex,
      navigator: this.props.navigator,
    })
  }

  render() {
    const { billRecord, splitRecord } = this.props;
    return(

      <View style={styles.container}>
        <View style={styles.billInfo}>
          <View style={styles.billInfoName}>

            <Text style={styles.billInfoBillName}>{billRecord.billName}</Text>
          </View>
          <View style={styles.billAmountInfo}>
            <Text>Total Bill Amount :
              <Text style={{color:'black'}}>
                {billRecord.totalBillAmount}
              </Text>
            </Text>
            <Text>Amount not split :
              <Text style={{color:'red'}}>
                {billRecord.totalBillAmount - splitRecord.totalAmountSplit}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={this.addNewItem}>
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

BillSplitScene.propTypes = {
  splitRecord: React.PropTypes.object,
  billRecord: React.PropTypes.object,
  dishSplitActions: React.PropTypes.object,
  navigator: React.PropTypes.object,
  billRecordIndex:React.PropTypes.string,
}

const matchStateToProps = (state, props) => {
  const billRecord = state.get('billRecordsReducer').get(props.billRecordIndex)
  let splitRecord;
  if(billRecord){
    splitRecord = state.get('splitRecordsReducer').get(billRecord.billID.toString())? state.get('splitRecordsReducer').get(billRecord.billID.toString()) : null;
  }
  return {
    billRecord,
    splitRecord
  }
}

const matchDispatchToProps = (dispatch) => {
  return{
    dishSplitActions: bindActionCreators(dishSplitActions,dispatch)
  }
}

export default connect(matchStateToProps, matchDispatchToProps)(BillSplitScene);

const styles  = StyleSheet.create({
  container: {
    flex:1,
  },
  // Bill info styles
  billInfo:{
    borderBottomWidth: 1,
    padding:10
  },
  billInfoName: {
  },
  billInfoBillName:{
    fontSize: 20,
  },

//action container styles
  actionsContainer:{
    flexDirection:'row',
    justifyContent:'flex-end',
    borderBottomWidth:1,
    padding: 5

  },
  addNewItemText: {
    color:'blue'
  },

  // list styles
  list : {
    flex: 1,
    padding: 5
  },
  item : {
    flex:1,
    minHeight: 50,
    marginBottom: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black'

  }
})
