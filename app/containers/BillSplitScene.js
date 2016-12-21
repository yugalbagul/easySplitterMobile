import React from 'react';
import { View, ListView, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { ROUTES } from '../constants'

class BillSplitScene extends React.Component {
  constructor(){
      super()
      const ds = new ListView.DataSource ({
        rowHasChanged : (r1,r2) => r1 != r2, // TODO: need deep equals function here
      })
      this.state = {
        dataSource: ds,
      }
      this.renderRow = this.renderRow.bind(this);
  }
  onDishRecordPress(rowData){
    this.props.navigator.push({
      title:'Dish Split Page',
      routeName: ROUTES.dishSplitPage,
      dishID: rowData.dishID,
      dishData: rowData,
      billData: this.props.billRecord
    });
  }
  renderRow(rowData,sectionID,rowID) {
    return (
      <TouchableHighlight style={styles.item} onPress={this.onDishRecordPress.bind(this,rowData,rowID)}>
        <View>
          <Text>{rowData.dishName}</Text>
        </View>
      </TouchableHighlight>
    )
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
  componentWillMount(){
    if(this.props.billRecord){
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
  render() {
    return(
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          style={styles.list}
        />
    )
  }
}

BillSplitScene.propTypes = {
  splitRecord: React.PropTypes.object,
  billRecord: React.PropTypes.object,
}

const matchStateToProps = (state, props) => {
  const billRecord = state.get('billRecordsReducer').get(props.billRecordIndex)
  let splitRecord;
  if(billRecord){
    splitRecord = state.get('splitRecordsReducer').get(billRecord.id.toString())? state.get('splitRecordsReducer').get(billRecord.id.toString()) : null;
  }
  return {
    billRecord,
    splitRecord
  }
}

const styles  = StyleSheet.create({
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


export default connect(matchStateToProps)(BillSplitScene);
