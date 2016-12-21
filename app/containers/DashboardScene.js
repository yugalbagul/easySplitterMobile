import React from 'react';
import { View, ListView, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { ROUTES } from '../constants';

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
  }
  onBillRecordPress(rowID, rowData){
    this.props.navigator.push({title: 'Bill Split Page', billRecordIndex: rowID, routeName: ROUTES.billSplitPage})
  }
  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight style={styles.item} onPress={this.onBillRecordPress.bind(this, rowID, rowData)}>
        <View >
          <Text>{rowData.restaurantName}</Text>
        </View>
      </TouchableHighlight>
    )
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.billRecords != this.props.billRecords){
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.billRecords)
      })
    }
  }

  componentWillUnmount () {
  }

  componentWillMount(){
    if(this.props.billRecords){
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.props.billRecords)
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

DashboardScene.propTypes = {
  billRecords: React.PropTypes.array,
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

const matchStateToProps = (state) => {
  const billRecords = state.get('billRecordsReducer') && state.get('billRecordsReducer').toJS ? state.get('billRecordsReducer').toJS() : [];
  return {
    billRecords
  }
}

export default connect(matchStateToProps)(DashboardScene);
