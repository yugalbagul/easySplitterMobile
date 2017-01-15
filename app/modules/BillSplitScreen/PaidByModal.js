import React from 'react';
import { Modal, ListView, View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export default class PaidByModal extends React.Component {
  constructor(){
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds
    };

    this.renderRow = this.renderRow.bind(this);
    this.onRequestCloseHandler = this.onRequestCloseHandler.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if(nextProps.showPaidByModal === this.props.showPaidByModal){
      return false
    }
    return true;
  }

  onSelectPaidBy(rowData){
    const { props: { setPaidByAction } } = this;
    if(rowData.id === 'multiple'){
      const paidByActionObject = {
        paidBy: 'multiple',
        multipleFlag: true,
        togglePaidByModal: true,
        toggleMultiplePaidByModal: true
      }
      setPaidByAction(paidByActionObject);
    } else {
      const paidByActionObject = {
        paidBy: rowData.id,
        togglePaidByModal: true,
      }
      setPaidByAction(paidByActionObject);
    }

  }

  onRequestCloseHandler(){
    const { props: { setPaidByAction } } = this;
    const paidByActionObject = {
      togglePaidByModal: true,
    }
    setPaidByAction(paidByActionObject);
  }

  renderRow(rowData,sectionID,rowID){
    return(
      <TouchableOpacity style={styles.paidByModalListItem} onPress={this.onSelectPaidBy.bind(this, rowData)}>
          <Text>{rowData.displayName}</Text>
      </TouchableOpacity>
    )
  }

  render(){
    return(
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.showPaidByModal}
        onRequestClose= {this.onRequestCloseHandler}
      >
        <View style={styles.paidByModalContainer}>
          <View style={styles.paidByModalInnerContainer}>
            <ListView
              dataSource={this.state.dataSource.cloneWithRows(this.props.people)}
              renderRow={this.renderRow}
              style={styles.paidByModalList}
              />
          </View>

        </View>
      </Modal>

    )
  }
}
