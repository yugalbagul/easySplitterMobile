import React from 'react';
import { Modal, ListView, View, Text, ScrollView, TouchableNativeFeedback, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { isEmpty } from 'lodash';
import { MKTextField, MKButton, MKCheckbox } from 'react-native-material-kit';
import { validationRegEx } from '../../../../constants';
import { styles, toolBarStyle } from './styles';
import { setPeopleInvovledAction,setPeopleInvovledModalAction } from '../../../../actions/billsActions';
import { addNewUserAction } from  '../../../../actions/processUserActions'
import { generateUserID } from '../../../../utils/generateIdUtils';

class PeopleInvolvedContainer extends React.Component {
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
    this.openModal = this.openModal.bind(this);
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
    InteractionManager.runAfterInteractions(() => {
      const tempPeopleInvolved = this.state.peopleInvolved;
      tempPeopleInvolved[index].selected = checked;
      this.setState({
        peopleInvolved: tempPeopleInvolved
      });
    })
  }

  openModal() {
    InteractionManager.runAfterInteractions(() => {
      const { props: { setPeopleInvovledModalStatus } } = this
      setPeopleInvovledModalStatus(true);
    })

  }

  addNewUser(){
    const { email } = this.state;

    if(validationRegEx.email.test(email)){
      const { props: { addNewUserAction, currentUser } } = this
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
      addNewUserAction( userRecord, currentUser);
    } else {
      this.setState({
        emailError: 'Please Enter a Valid E-mail'
      });
    }
  }

  render(){
    const { peopleInvolved } = this.state;
    const { props: { currentPeople } } = this
    return(
      <View style={styles.container}>
        <View style={styles.triggerContainer}>
          <View style={{flex:1}}>
            <MaterialIcons size={28} name={'people-outline'} style={styles.triggerContainerIcon}/>
          </View>
        <TouchableNativeFeedback onPress={this.openModal} >
            <View style={styles.triggerContainerNamesList}>
              { currentPeople && !isEmpty(currentPeople) ? currentPeople.map(person => {
                let lastIndex = false;
                if(currentPeople.indexOf(person) === (currentPeople.length - 1)){
                  lastIndex = true;
                }
                return(
                  <View key={person.id} style={styles.triggerContainerItemContainer}>
                    <Text style={styles.triggerContainerNamesListItem}>{person.displayName}{lastIndex?null: ','}</Text>
                  </View>
                )
              }) :
              <View style={styles.triggerContainerItemContainer}>
                <Text style={styles.triggerContainerNamesListItem}>Click To choose</Text>
              </View>
              }
            </View>
        </TouchableNativeFeedback>
      </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.showPeopleInvovledModal}
          onRequestClose= {this.onRequestCloseHandler}
        >
          <View >
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
                  Select People
                </Text>
            </View>
          </MaterialIcons.ToolbarAndroid>
            <View style={styles.addNewUserContainer}>
              <View style={{paddingHorizontal:16, marginTop: 8}}>
                <Text style={{ color:'#18435A', fontSize: 16 }}>
                  Add a New Connections
                </Text>
              </View>
              <View style={styles.newUserForm}>
                <View style={styles.formIconContainer}>
                  <MaterialIcons size={24} name={'email'} style={styles.triggerContainerIcon}/>
                </View>
                <View style={styles.formEmailContainer}>
                    <MKTextField
                      keyboardType={'email-address'}
                      textInputStyle={styles.emailTextField}
                      value={this.state.email}
                      onChange={(event) => {this.setState({ email: event.nativeEvent.text, emailError:'' })}}
                      underlineSize= {1}
                      placeholder={'Enter User Email'}
                      onEndEditing= {this.validateEmail}
                    />
                    {this.state.emailError ?
                      <View style={styles.emailErrorContainer}>
                          <Text style={{color:'red'}}>{this.state.emailError}</Text>
                      </View>
                      : null}

              </View>

            </View>

            <View style={{width: 50, marginTop:8, height: 40, alignItems:'flex-start', marginLeft: 16 }}>
              <MKButton
                backgroundColor={'#276191'}
                shadowRadius={2}
                shadowOffset={{width:0, height:2}}
                shadowOpacity={.7}
                shadowColor="black"
                onPress={this.addNewUser}
                style={{
                  borderRadius: 2,
                  paddingHorizontal: 10,
                  paddingVertical:5

                }}
                >
                <Text pointerEvents="none"
                      style={{color: 'white', fontWeight: 'bold',}}>
                  ADD
                </Text>
              </MKButton>
            </View>

            </View>
            <View style={{borderBottomWidth:1, borderColor: 'grey'}}>
            </View>
            <View style={{paddingHorizontal:16, marginTop: 8}}>
              <Text style={{ color:'#18435A', fontSize: 16 }}>
                Select from your friends
              </Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
              {peopleInvolved.map((personInfo, index) => {
                return (  <View style={styles.personRow} key={personInfo.id}>
                  <View>
                    <MKCheckbox
                      checked={personInfo.selected}
                      onCheckedChange={(obj) => { this.onUserSelected(obj.checked, index)}}
                    />
                  </View>
                  <View style={{paddingTop: 8}}>
                    <Text style={styles.personDisplayName}>{personInfo.displayName}</Text>
                  </View>
                 </View>)
              })
              }
            </ScrollView>

          </View>
        </Modal>

      </View>

    )
  }
}

PeopleInvolvedContainer.propTypes = {
  allUserRecords: React.PropTypes.object,
  currentPeople: React.PropTypes.array,
  setPeopleInvovled: React.PropTypes.func,
  setPeopleInvovledModalStatus: React.PropTypes.func,
  setPeopleInvovledModalAction: React.PropTypes.func,
  currentBillAmount: React.PropTypes.string,
  showPeopleInvovledModal: React.PropTypes.bool,
  multiplePaideByRecord: React.PropTypes.array,
  addNewUserAction: React.PropTypes.func,
  currentUser:  React.PropTypes.object
}

const matchStateToProps = state => {
  return {
    currentPeople: state.get('billSplitReducer').get('currentPeople'),
    showPeopleInvovledModal: state.get('billSplitReducer').get('showPeopleInvovledModal'),
    currentUser: state.get('loginReducer').get('currentUser') ? state.get('loginReducer').get('currentUser').toJS() : null,
    allUserRecords : state.get('userRecordsReducer') && state.get('userRecordsReducer').toJS ? state.get('userRecordsReducer').toJS() : null
  }
}

const matchDispatchToProps = (dispatch) => {
  return{
    setPeopleInvovledModalStatus: bindActionCreators(setPeopleInvovledModalAction, dispatch),
    setPeopleInvovled: bindActionCreators(setPeopleInvovledAction, dispatch),
    addNewUserAction: bindActionCreators(addNewUserAction, dispatch)
  }
}

export default connect(matchStateToProps, matchDispatchToProps)(PeopleInvolvedContainer);
