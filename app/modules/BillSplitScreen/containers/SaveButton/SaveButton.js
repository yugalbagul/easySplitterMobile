import React from 'react';
import { View, Text, StyleSheet  } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { persistBillRecordAction  } from '../../../../actions/billsActions'
import { MKButton } from 'react-native-material-kit'
import createBillPersistRecord from '../../../../utils/createBillPersistRecord';

class SaveButton extends React.Component {
  constructor(){
    super();
    this.saveBill = this.saveBill.bind(this);
  }
  shouldComponentUpdate() {
    return false;
  }

  saveBill(){
    // call util function which creats records to save to database from the props
    const actionParams = createBillPersistRecord(this.props);
    this.props.persistBillRecordAction(actionParams);
  }

  render(){
    return(
      <View style={styles.saveButtonContainer}>
        <MKButton
          backgroundColor={'#2A628F'}
          shadowRadius={2}
          shadowOffset={{width:0, height:2}}
          shadowOpacity={.7}
          shadowColor="black"
          onPress={this.saveBill}
          style={{
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical:10,
            marginTop: 16,
            marginBottom: 16,
            justifyContent: 'center',
            alignItems: 'center'

          }}
          >
          <Text pointerEvents="none"
                style={{color: 'white', fontWeight: 'bold',}}>
            SAVE BILL
          </Text>
        </MKButton>
      </View>)
  }
}

const matchStateToProps = state => {
  return{
    billRecord: state.get('billSplitReducer').get('billRecord') ? state.get('billSplitReducer').get('billRecord').toJS() : null,
    splitRecord: state.get('billSplitReducer').get('splitRecord')? state.get('billSplitReducer').get('splitRecord').toJS() : null,
    currentPeople: state.get('billSplitReducer').get('currentPeople'),
    currentBillName: state.get('billSplitReducer').get('currentBillName'),
    currentBillAmount: state.get('billSplitReducer').get('currentBillAmount'),
    currentBillDate: state.get('billSplitReducer').get('currentBillDate'),
    paidBy: state.get('billSplitReducer').get('paidBy'),
    multiplePaideByRecord: state.get('billSplitReducer').get('multiplePaideByRecord'),
    newBill: state.get('billSplitReducer').get('newBill'),
    currentUser: state.get('loginReducer').get('currentUser') ? state.get('loginReducer').get('currentUser').toJS() : null,

  }
}

const matchDispatchToProps = dispatch => {
  return{
    persistBillRecordAction: bindActionCreators(persistBillRecordAction, dispatch),
  }
}

SaveButton.propTypes = {
  persistBillRecordAction: React.PropTypes.func
}

const styles = StyleSheet.create({
  saveButtonContainer:{
    justifyContent: 'center',
  }
})

export default connect(matchStateToProps, matchDispatchToProps)(SaveButton)
