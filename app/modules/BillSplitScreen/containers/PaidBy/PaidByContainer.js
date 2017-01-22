import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, ListView, View, Text, TouchableNativeFeedback } from 'react-native';
import { setPaidByAction } from '../../../../actions/billsActions';
import MultiplePaidByModal from '../../components/MultiplePaidByModal';
import { styles } from './styles';

class PaidByContainer extends React.Component {
  constructor(){
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds
    };

    this.renderRow = this.renderRow.bind(this);
    this.togglePaidByModal = this.togglePaidByModal.bind(this);
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
      console.log('Setting Multiple Paid By');
      setPaidByAction(paidByActionObject);
    } else {
      const paidByActionObject = {
        paidBy: rowData.id,
        togglePaidByModal: true,
      }
      setPaidByAction(paidByActionObject);
    }

  }

  togglePaidByModal(){
    const { props: { setPaidByAction } } = this;
    const paidByActionObject = {
      togglePaidByModal: true,
    }
    setPaidByAction(paidByActionObject);
  }

  renderRow(rowData){
    return(
      <TouchableNativeFeedback style={styles.paidByModalListItem} onPress={this.onSelectPaidBy.bind(this, rowData)}>
          <Text>{rowData.displayName}</Text>
      </TouchableNativeFeedback>
    )
  }

  render(){
    const { props: { currentPeople, paidBy, showPaidByModal} } = this
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
        <View style={styles.triggerContainer}>
          <View style={styles.triggerIconContainer}>
            <Text style={styles.triggerIcon}> PaidBy </Text>
          </View>
          <TouchableNativeFeedback onPress={this.togglePaidByModal} >
            <View style={styles.triggerTextContainer}>
              <Text style={styles.triggerText}>
                {paidByText}
              </Text>
            </View>
        </TouchableNativeFeedback>
        </View>

        {showPaidByModal ? <Modal
          animationType="fade"
          transparent={true}
          visible={showPaidByModal}
          onRequestClose= {this.togglePaidByModal}
        >
          <View style={styles.paidByModalContainer}>
            <View style={styles.paidByModalInnerContainer}>
              <ListView
                dataSource={this.state.dataSource.cloneWithRows(peopleArray)}
                renderRow={this.renderRow}
                style={styles.paidByModalList}
                />
            </View>

          </View>
        </Modal>: null}
        <MultiplePaidByModal />
      </View>


    )
  }
}

PaidByContainer.propTypes = {
  currentPeople: React.PropTypes.array,
  paidBy: React.PropTypes.string,
  showPaidByModal: React.PropTypes.bool,
  setPaidByAction: React.PropTypes.func,
  multiplePaideByRecord: React.PropTypes.object,
  currentBillAmount: React.PropTypes.number
}

const matchStateToProps = (state) => {
  return {
    currentPeople: state.get('billSplitReducer').get('currentPeople'),
    paidBy: state.get('billSplitReducer').get('paidBy'),
    showPaidByModal: state.get('billSplitReducer').get('showPaidByModal'),
    currentBillAmount: state.get('billSplitReducer').get('currentBillAmount'),
  }
}

const matchDispatchToProps = (dispatch) => {
  return{
    setPaidByAction: bindActionCreators(setPaidByAction,dispatch),
  }
}

export default connect(matchStateToProps, matchDispatchToProps)(PaidByContainer)
