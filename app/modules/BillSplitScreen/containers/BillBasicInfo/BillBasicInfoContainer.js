import React from 'react';
import { View, TextInput, DatePickerAndroid, TouchableNativeFeedback, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DateComponent } from '../../../../components/DateComponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { onBillNameChangeAction, onBillAmountChangeAction, onBillDateChangeAction  } from '../../../../actions/billBasicInfoActions';
import { MKTextField } from 'react-native-material-kit';
import { billBasicInfo as styles } from './styles';


class BillBasicInfoContainer extends React.Component {
  constructor(){
    super();
    this.onBillNameChange = this.onBillNameChange.bind(this);
    this.onBillAmountChange = this.onBillAmountChange.bind(this);
    this.showDatePicker = this.showDatePicker.bind(this);
  }

  onBillNameChange(event) {
    this.props.onBillNameChangeAction(event.nativeEvent.text)
  }
  onBillAmountChange(event) {
    const newText = event.nativeEvent.text;
    const isNumber = /^\d+(?:\.)?(?:\d+)?$/.test(newText);
    if(isNumber || !newText){
      this.props.onBillAmountChangeAction(newText)
    }
  }

  showDatePicker(){
    const options = {
      date: new Date(),
    }
    DatePickerAndroid.open(options).then(({ action, year , month, day }) => {
      if (action !== DatePickerAndroid.dismissedAction) {
        const tempDate = new Date(year, month, day);
        this.props.onBillDateChangeAction(tempDate);
      }
    }).catch(err => console.log(err));
  }

  render(){
    const { props: { currentBillName, currentBillAmount, currentBillDate } } = this
    return(
      <View style={styles.container}>
        <View style={styles.billInfoContainer}>
          <View style={styles.billNameImageContainer}>
            <View style={styles.billNameImageView}>
              <Image
                source={require('../../../../../assets/images/billNameIcon-24.png')}
                style={styles.billNameImage}
              />
            </View>

        </View>
        <View style={styles.billNameTextInutContainer}>

          <TextInput
            placeholder={'Enter Bill name you whore'}
            value={currentBillName}
            underlineColorAndroid={'#E0E0E0'}
            autoCorrect = {false}
            style={styles.billInfoBillName}
            onChange={(event) => {this.onBillNameChange(event)}}
          />
        </View>

        </View>
        <View style={styles.billInfoSecondRow}>
          <View style={styles.secondRowCol1}>
            <View>
            <Image
              source={require('../../../../../assets/images/currency-inr.png')}
              style={styles.billAmountImage}
            />
          </View>
          <View style={{flex:2}}>
            <MKTextField
              keyboardType={'numeric'}
              textInputStyle={styles.amountTextField}
              value={currentBillAmount?currentBillAmount.toString() : ''}
              onChange={(event) => {this.onBillAmountChange(event)}}
              underlineSize= {1}
              placeholder={'00.00'}
            />
        </View>
          </View>

          <View style={styles.secondRowCol2}>
            <TouchableNativeFeedback
              onPress={this.showDatePicker}
              >
              <View style={styles.dateConntainer}>
                <View style={{flex: 1}}>
                  <MaterialIcons size={24} name={'today'} style={styles.billDateIcon}/>
                </View>
                <View style={styles.dateCompnentContainer}>
                  <DateComponent date={currentBillDate} style={styles.dateComponentStyle}/>

                </View>
              </View>
            </TouchableNativeFeedback>
          </View>

        </View>

      </View>

    )
  }
}

BillBasicInfoContainer.propTypes = {
  onBillNameChangeAction: React.PropTypes.func,
  onBillAmountChangeAction: React.PropTypes.func,
  onBillDateChangeAction: React.PropTypes.func,
  currentBillName: React.PropTypes.string,
  currentBillAmount: React.PropTypes.number,
  billRecordID: React.PropTypes.string,
  currentBillDate: React.PropTypes.instanceOf(Date)
}

const matchStateToProps = state => {
  return{
    currentBillName: state.get('billSplitReducer').get('currentBillName'),
    currentBillAmount: state.get('billSplitReducer').get('currentBillAmount'),
    currentBillDate: state.get('billSplitReducer').get('currentBillDate'),
  }
}

const matchDispatchToProps = dispatch => {
  return{
    onBillNameChangeAction: bindActionCreators(onBillNameChangeAction, dispatch),
    onBillAmountChangeAction: bindActionCreators(onBillAmountChangeAction, dispatch),
    onBillDateChangeAction: bindActionCreators(onBillDateChangeAction, dispatch),
  }
}


export default connect(matchStateToProps, matchDispatchToProps)(BillBasicInfoContainer)
