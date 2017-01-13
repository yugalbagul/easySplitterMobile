import React from 'react';
import { Modal, ListView, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import CheckBox from 'react-native-checkbox';
import { isEmpty } from 'lodash';
import { multiplePaidByModalStyles as styles } from './styles';

export default class MultiplePaidByModal extends React.Component {
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

  componentWillMount(){
    const { props: { people, multiplePaideByRecord } } = this;
    console.log('in multiple modal');;
    console.log(multiplePaideByRecord);
    if(!isEmpty(people)){
      let tempPaidAmountCovered = 0;
      const payersArray = [];
      if(!isEmpty(multiplePaideByRecord)){
        people.map((person) => {
          const paidByPersonRecord = multiplePaideByRecord.find((item) => item.id === person.id);
          const tempPayer = Object.assign({}, person , {
            selected: false,
            amountPaid: paidByPersonRecord ? paidByPersonRecord.amountPaid : ''
          })
          tempPaidAmountCovered += paidByPersonRecord ? paidByPersonRecord.amountPaid : 0;
          payersArray.push(tempPayer);
        })
      } else {
        people.map((person) => {
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
        visible={this.props.showModal}
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
  people: React.PropTypes.array,
  setPaidByAction: React.PropTypes.func,
  currentBillAmount: React.PropTypes.string,
  showModal: React.PropTypes.bool,
  multiplePaideByRecord: React.PropTypes.array
}
