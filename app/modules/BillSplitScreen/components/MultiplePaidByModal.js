import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, ListView, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import CheckBox from 'react-native-checkbox';
import { setPaidByAction } from '../../../actions/billsActions';
import { isEmpty, isEqual } from 'lodash';
import { multiplePaidByModalStyles as styles } from '../styles';

class MultiplePaidByModal extends React.Component {
  constructor(){
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds,
      payersArray: [],
      paidAmountCovered: 0
    };

    this.onRequestCloseHandler = this.onRequestCloseHandler.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onUserAmountPaidChange = this.onUserAmountPaidChange.bind(this);
  }



  componentWillReceiveProps(nextProps){
    const { props: { currentPeople, multiplePaideByRecord } } = this;
    if(!isEmpty(nextProps.currentPeople) && (!isEqual(currentPeople, nextProps.currentPeople) || isEmpty(this.state.payersArray))){
      let tempPaidAmountCovered = 0;
      const payersArray = [];
      if(!isEmpty(multiplePaideByRecord)){
        currentPeople.map((person) => {
          const paidByPersonRecord = multiplePaideByRecord.find((item) => item.id === person.id);
          const tempPayer = Object.assign({}, person , {
            selected: false,
            amountPaid: paidByPersonRecord ? paidByPersonRecord.amountPaid : ''
          })
          tempPaidAmountCovered += paidByPersonRecord ? paidByPersonRecord.amountPaid : 0;
          payersArray.push(tempPayer);
        })
      } else {
        currentPeople.map((person) => {
          const tempPayer = Object.assign({}, person , {
            selected: false,
            amountPaid: ''
          })
          payersArray.push(tempPayer);
        })
      }
      this.setState({
        payersArray: payersArray,
        paidAmountCovered: tempPaidAmountCovered
      });
    }
  }

  shouldComponentUpdate(nextProps){
    if(nextProps.showMultiplePaidByModal === this.props.showMultiplePaidByModal){
      return false
    }
    return true;
  }

  onSave(){
    const { props: { setPaidByAction, currentBillAmount } } = this;
    const { payersArray, paidAmountCovered } = this.state;
    const remainingAmount = currentBillAmount - paidAmountCovered;
    if(remainingAmount === 0){
      const paidByArray = [];
      payersArray.map((record) => {
        if(record.amountPaid){
          const tempRecord = {
            id: record.id,
            amountPaid: parseFloat(record.amountPaid)
          }
          paidByArray.push(tempRecord);
        }

      })
      const paidByActionObject = {
        multiplePaideByRecord: paidByArray,
        toggleMultiplePaidByModal: true,
        togglePaidByModal: true,
      }
      setPaidByAction(paidByActionObject);
    }
  }

  onRequestCloseHandler(){
    const { props: { setPaidByAction } } = this;
    const paidByActionObject = {
      toggleMultiplePaidByModal: true,
    }
    setPaidByAction(paidByActionObject);
  }

  onUserAmountPaidChange(event, index){
    let newInputText = event.nativeEvent.text;
    const isNumber = /^\d+(?:\.)?(?:\d+)?$/.test(newInputText);
    if(isNumber || newInputText === ''){
      const previousAmount = this.state.payersArray[index].amountPaid ? parseFloat(this.state.payersArray[index].amountPaid) : 0;
      const deltaChange = (newInputText?parseFloat(newInputText):0) - previousAmount
      const tempPayersArray = this.state.payersArray;
      tempPayersArray[index].amountPaid = newInputText;
      this.setState({
        payersArray: tempPayersArray,
        paidAmountCovered: this.state.paidAmountCovered + deltaChange
      });
    }
  }

  render(){
    const { payersArray, paidAmountCovered } = this.state;
    const { currentBillAmount  } = this.props
    const remainingAmount = currentBillAmount - paidAmountCovered;
    return(
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.showMultiplePaidByModal}
        onRequestClose= {this.onRequestCloseHandler}
      >
        <View style={styles.container}>
          <View style={styles.remainingAmount}>
            <Text>
                Total : Rs.{paidAmountCovered} of Rs.{currentBillAmount}
            </Text>
            <Text>
                Remaining : Rs.{remainingAmount}
            </Text>
            <TouchableOpacity onPress={this.onSave}>
              <Text style={{padding:10}}>Save</Text>
            </TouchableOpacity>
          </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
              { isEmpty(payersArray)? <Text> No peroson added to bill yet </Text> :
                  payersArray.map((personInfo, index) => {
                    return (  <View style={styles.personRow} key={personInfo.id}>
                      <Text>
                       {personInfo.displayName}
                      </Text>
                       <TextInput
                          keyboardType={'numeric'}
                          value={personInfo.amountPaid.toString()}
                          onChange={(event) => {this.onUserAmountPaidChange(event, index )}}
                          style={{width:50, height: 40, marginBottom: 5}}
                        />


                     </View>)
                  })


            }
            </ScrollView>

        </View>
      </Modal>

    )
  }
}

MultiplePaidByModal.propTypes = {
  currentPeople: React.PropTypes.array,
  setPaidByAction: React.PropTypes.func,
  currentBillAmount: React.PropTypes.number,
  showMultiplePaidByModal: React.PropTypes.bool,
  multiplePaideByRecord: React.PropTypes.array
}

const matchStateToProps = (state) => {
  return {
    currentPeople: state.get('billSplitReducer').get('currentPeople'),
    showMultiplePaidByModal: state.get('billSplitReducer').get('showMultiplePaidByModal'),
    multiplePaideByRecord: state.get('billSplitReducer').get('multiplePaideByRecord'),
    currentBillAmount: state.get('billSplitReducer').get('currentBillAmount')
  }
}

const matchDispatchToProps = (dispatch) => {
  return{
    setPaidByAction: bindActionCreators(setPaidByAction,dispatch),
  }
}

export default connect(matchStateToProps, matchDispatchToProps)(MultiplePaidByModal)
