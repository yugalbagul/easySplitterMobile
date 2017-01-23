import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, ListView, View, Text,ScrollView, TouchableNativeFeedback, InteractionManager, TextInput } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { MKTextField } from 'react-native-material-kit';
import CheckBox from 'react-native-checkbox';
import { setPaidByAction } from '../../../actions/billsActions';
import { isEmpty, isEqual } from 'lodash';
import { multiplePaidByModalStyles as styles, toolBarStyle } from '../styles';

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
      console.log(newInputText);
      const previousAmount = this.state.payersArray[index].amountPaid ? parseFloat(this.state.payersArray[index].amountPaid) : 0;
      const deltaChange = (newInputText?parseFloat(newInputText):0) - previousAmount
      const tempPayersArray = this.state.payersArray;
      tempPayersArray[index].amountPaid = newInputText;
      console.log(tempPayersArray);
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
          <MaterialIcons.ToolbarAndroid
            style= {{
              backgroundColor: '#225786',
              height: 56,
              elevation: 10,
            }}
            navIconName= 'close'
            iconColor= 'white'
            onIconClicked={this.onRequestCloseHandler}
            actions={[
              {
                title:'Done',
                iconName: 'done',
                iconColor: 'white',
                show: 'always'
              }
            ]}
            onActionSelected={this.onSave}
          >
          <View style={toolBarStyle.toolBarContainer}>
              <Text style={toolBarStyle.titleStyle}>
                Select Payers
              </Text>
          </View>
        </MaterialIcons.ToolbarAndroid>
        <View style={styles.remainingAmountContainer}>
          <View >
            <Text style={styles.remainingAmountRow1Text}>
                Total : {'\u20B9'}{paidAmountCovered} of {'\u20B9'}{currentBillAmount}
            </Text>

          </View>
          <View >
            <Text style={styles.remainingAmountRow2Text}>
                {'\u20B9'}{remainingAmount} left.
            </Text>
          </View>
        </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
              { isEmpty(payersArray)? <Text> No peroson added to bill yet </Text> :
                  payersArray.map((personInfo, index) => {
                    return (  <View style={styles.personRowContainer} key={personInfo.id}>
                      <View style={styles.nameContainer}>
                        <Text style={styles.nameTextStyle}>
                         {personInfo.displayName}
                        </Text>
                      </View>
                      <View style={styles.amountContainer}>
                        <View style={{ justifyContent:'center', flex:1}}>
                          <Text style={styles.currencyText}>{'\u20B9'}</Text>
                        </View>
                        <View style={{ justifyContent:'center', flex:3}}>
                        <MKTextField
                           keyboardType={'numeric'}
                           value={personInfo.amountPaid.toString()}
                           onChange={(event) => {this.onUserAmountPaidChange(event, index )}}
                           style={{width: 50, height: 40}}
                           textInputStyle={{color: '#276191'}}
                         />
                       </View>
                      </View>
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
