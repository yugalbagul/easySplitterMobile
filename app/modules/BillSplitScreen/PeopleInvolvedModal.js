import React from 'react';
import { Modal, ListView, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import CheckBox from 'react-native-checkbox';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Hideo } from 'react-native-textinput-effects';
import { isEmpty } from 'lodash';
import { validationRegEx } from '../../constants';
import { peopleInvolvedModal as styles } from './styles';
import { setPeopleInvovledAction,setPeopleInvovledModalAction } from '../../actions/billsActions';
import { addNewUserAction } from  '../../actions/processUserActions'
import { generateUserID } from '../../utils/generateIdUtils';

class PeopleInvolvedModal extends React.Component {
  constructor(){
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds,
      peopleInvolved: [],
      email:'',
      emailError:''
    };

    this.onRequestCloseHandler = this.onRequestCloseHandler.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onUserSelected = this.onUserSelected.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.addNewUser = this.addNewUser.bind(this);
  }

  componentWillMount(){
    const { props: { allUserRecords, currentPeople } } = this;
    if(!isEmpty(allUserRecords)){
      const peopleInvolvedArray = [];
      Object.keys(allUserRecords).map((key) => {
        const person = allUserRecords[key];
        let isSelected = (currentPeople.findIndex((item) => item.id === person.id));

        isSelected = isSelected === -1 ? false : true;
        const tempPerson = Object.assign({}, person , {
          selected: isSelected,
        })
        if(isSelected){
          peopleInvolvedArray.unshift(tempPerson)
        } else {
          peopleInvolvedArray.push(tempPerson);
        }
      })
      this.setState({
        peopleInvolved: peopleInvolvedArray,
      });
    }
  }

  onSave(){
    const { props: { setPeopleInvovled, } } = this;
    const { peopleInvolved } = this.state;
    if(!isEmpty(peopleInvolved)){
      const peopleArray = [];
      peopleInvolved.map((record) => {
        if(record.selected){
          const tempObject = Object.assign({},record);
          delete tempObject.selected;
          peopleArray.push(tempObject);
        }
      })
      const paidByActionObject = {
        peopleInvolved: peopleArray,
      }
      setPeopleInvovled(paidByActionObject);
    }
  }

  validateEmail() {
    const { email } = this.state;
    if(!validationRegEx.email.test(email)){
      this.setState({
        emailError: 'Please Enter a Valid E-mail'
      });
    }
  }

  onRequestCloseHandler(){
    const { props: { setPeopleInvovledModalStatus } } = this;
    setPeopleInvovledModalStatus(false);
  }

  onUserSelected(checked, index){
    const tempPeopleInvolved = this.state.peopleInvolved;
    tempPeopleInvolved[index].selected =  !checked;
    this.setState({
      peopleInvolved: tempPeopleInvolved
    });
  }

  addNewUser(){
    const { email } = this.state;
    const { props: { addNewUserAction, currentUser } } = this
    if(validationRegEx.email.test(email)){
      const newUserObject = {
        displayName: email,
        email: email,
        selected: true,
        id: generateUserID()
      }
      const tempArray = this.state.peopleInvolved;
      tempArray.push(newUserObject);
      this.setState({
        peopleInvolved: tempArray
      });
      const userRecord = Object.assign({}, newUserObject);
      delete userRecord.selected;
      this.props.addNewUserAction( userRecord, currentUser);
    } else {
      this.setState({
        emailError: 'Please Enter a Valid E-mail'
      });
    }
  }

  render(){
    const { peopleInvolved } = this.state;
    console.log(peopleInvolved);
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
                Add People Involved in the bill
            </Text>
            <TouchableOpacity onPress={this.onSave}>
              <Text>Save</Text>
            </TouchableOpacity>
            <View style={styles.newPersonForm}>
              <Text style={{ color: 'black', paddingVertical: 3 }}>
                New:
              </Text>
              <View style={styles.emailInputContainer}>
                <Hideo
                  iconClass={FontAwesomeIcon}
                  iconName={'envelope'}
                  iconColor={'white'}
                  iconBackgroundColor={'grey'}
                  inputStyle={{ color: '#464949' }}
                  value={this.state.email}
                  onChange={(event) => {this.setState({ email: event.nativeEvent.text, emailError:'' })}}
                  onEndEditing= {this.validateEmail}
                  keyboardType={'email-address'}
                />
              </View>
              <TouchableOpacity onPress={this.addNewUser}>
                <Text>Add</Text>
              </TouchableOpacity>
            </View>
            {this.state.emailError ?
              <View style={styles.emailError}>
                <View style={{alignSelf: 'flex-start'}}>
                  <Text >{this.state.emailError}</Text>
                </View>
              </View>: null}
          </View>
          <ScrollView contentContainerStyle={styles.scrollView}>
            {peopleInvolved.map((personInfo, index) => {
              return (  <View style={styles.personRow} key={personInfo.id}>
                <CheckBox
                  checked={personInfo.selected}
                  label={personInfo.displayName}
                  onChange={(checked) => {this.onUserSelected(checked, index)}}
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

PeopleInvolvedModal.propTypes = {
  allUserRecords: React.PropTypes.object,
  currentPeople: React.PropTypes.array,
  setPeopleInvovled: React.PropTypes.func,
  setPeopleInvovledModalStatus: React.PropTypes.func,
  currentBillAmount: React.PropTypes.string,
  showModal: React.PropTypes.bool,
  multiplePaideByRecord: React.PropTypes.array,
  addNewUserAction: React.PropTypes.func
}

const matchDispatchToProps = (dispatch) => {
  return{
    setPeopleInvovledModalStatus: bindActionCreators(setPeopleInvovledModalAction, dispatch),
    setPeopleInvovled: bindActionCreators(setPeopleInvovledAction, dispatch),
    addNewUserAction: bindActionCreators(addNewUserAction, dispatch)
  }
}

export default connect(null, matchDispatchToProps)(PeopleInvolvedModal);
