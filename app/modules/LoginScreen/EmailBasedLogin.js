import React from 'react';
import { View, Text, InteractionManager  } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux';
import { MKTextField, MKButton } from 'react-native-material-kit';
import { emailLoginStyle as styles, loginContainerStyles } from './styles';
import { LoginProviders, validationRegEx } from '../../constants';
import { firebaseAuth } from '../../../config/firebase/firebaseConfig';
import { processLoginAction } from '../../actions/loginActions';

const TextfieldWithFloatingLabel = MKTextField.textfieldWithFloatingLabel().build();

const FlatButton = MKButton.flatButton().build();

class EmailBasedLoginScene extends React.Component {
  constructor(){
    super()
    this.state = {
      email: 'saurabh29@gmail.com',
      eamilError: '',
      password: 'password',
      passwordError: '',
      name: '',
      nameError: ''
    }
    this.onLogin = this.onLogin.bind(this);
    this.onSignup = this.onSignup.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);
  }

  validatePassword() {
    const { password } = this.state;
    if(password.length < 6){
      this.setState({
        passwordError: 'Password min length is 6'
      });
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

  onSubmitClick(){
    if( this.props.status === 'signup'){
      this.onSignup()
    } else {
      this.onLogin();
    }

  }

  onSignup(){
    const { name, email, password } = this.state;
    // test for incorrect email passowrd
    if(!validationRegEx.email.test(email) || password.length < 6 || !validationRegEx.name.test(name)){
      this.setState({
        emailError: !validationRegEx.email.test(email)? 'Please Enter a Valid E-mail' : '',
        passwordError: password.length < 6 ? 'Password min length is 6': '',
        nameError: !validationRegEx.name.test(name) ? 'Please Enter a valid name ( only character and spaces )' : ''
      });
    } else {
      // call aciton creator
      const userdata = {
        email: email,
        password: password,
        displayName: name
      }
      firebaseAuth.createUserWithEmailAndPassword(email,password).then(() => {
        this.props.processLoginAction({ userData: userdata, provider: LoginProviders.firebase })
      }).catch(err => {
        this.props.processLoginAction({ error: err, provider: LoginProviders.firebase })
      })
    }
  }

  onLogin() {
    const {  email, password } = this.state;
    // test for incorrect email passowrd
    if(!validationRegEx.email.test(email) || password.length < 6 ){
      this.setState({
        emailError: !validationRegEx.email.test(email)? 'Please Enter a Valid E-mail' : '',
        passwordError: password.length < 6 ? 'Password min length is 6': '',
      });
    } else {
      // call aciton creator
      const userdata = {
        email: email,
        password: password,
      }
      firebaseAuth.signInWithEmailAndPassword(email,password).then(() => {
        this.props.processLoginAction({ userData: userdata, provider: LoginProviders.firebase })
      }).catch(err => {
        console.log(err);
        this.props.processLoginAction({ error: err, provider: LoginProviders.firebase })
      })
    }
  }

  onCancel() {
    InteractionManager.runAfterInteractions(() => {
      Actions.pop();
    })
  }

  render(){
    const { props: { status } } = this
    return(
      <View style={loginContainerStyles.container}>
        <View style={loginContainerStyles.topContainer}>
          <Text style={styles.appNameText}>
            Easy Splitter
          </Text>
        </View>
        <View style={loginContainerStyles.middleContainer}>
        {status === 'signup' && <View style={styles.nameContainer}>
          <TextfieldWithFloatingLabel
            placeholder={'Name'}
            textInputStyle={{ color: '#464949', minWidth: 320 }}
            value={this.state.name}
            onChange={(event) => {this.setState({ name: event.nativeEvent.text, nameError:'' })}}
            onEndEditing= {this.validateName}
            keyboardType={'email-address'}
            floatingLabelFont = {({
              fontSize: 10,
              fontStyle: 'italic',
              fontWeight: '200',
            })}
          />
          {this.state.nameError ?
            <View style={styles.emailError}>
              <View style={{alignSelf: 'flex-start'}}>
                <Text >{this.state.nameError}</Text>
              </View>
            </View>: null}
        </View> }
        <View style={styles.emailContainer}>
          <View style={styles.credsContainer}>
            <TextfieldWithFloatingLabel
              placeholder={'Email'}
              textInputStyle={{ color: '#464949', minWidth: 320 }}
              value={this.state.email}
              onChange={(event) => {this.setState({ email: event.nativeEvent.text, emailError:'' })}}
              onEndEditing= {this.validateEmail}
              keyboardType={'email-address'}
              floatingLabelFont = {({
                fontSize: 10,
                fontStyle: 'italic',
                fontWeight: '200',
              })}
            />
          </View>
          {this.state.emailError ?
            <View style={styles.emailError}>
              <View style={{alignSelf: 'flex-start'}}>
                <Text >{this.state.emailError}</Text>
              </View>
            </View>: null}
        </View>
        <View style={styles.passwordContainer}>
          <TextfieldWithFloatingLabel
            placeholder={'Password'}
            textInputStyle={{ color: '#464949', minWidth: 320 }}
            value={this.state.password}
            onChange={(event) => {this.setState({ password: event.nativeEvent.text, passwordError:'' })}}
            onEndEditing= {this.validatePassword}
            secureTextEntry={true}
            floatingLabelFont = {({
              fontSize: 10,
              fontStyle: 'italic',
              fontWeight: '200',
            })}
          />
          {this.state.passwordError ?
            <View style={styles.emailError}>
              <View style={{alignSelf: 'flex-start'}}>
                <Text >{this.state.passwordError}</Text>
              </View>
            </View>: null}
        </View>
        <View style={styles.buttonContainer}>
          <MKButton
            backgroundColor={'#003051'}
            shadowRadius={5}
            shadowOffset={{width:0, height:5}}
            shadowOpacity={.7}
            shadowColor="black"
            onPress={this.onSubmitClick}
            style={{
              padding: 10,
              borderRadius: 3
            }}
            >
          <Text pointerEvents="none" style={{color: 'white', textAlign: 'center' }}>
            {status === 'signup' ? 'Register' : 'Sign In' }
          </Text>
        </MKButton>
        </View>
        <View style={styles.cancelContainer}>
          <FlatButton
            style={{
              padding: 10,
              borderRadius: 3
            }}
            onPress={this.onCancel}
            >
          <Text pointerEvents="none" style={{color: '#276191', textAlign: 'center' }}>
            Cancel
          </Text>
        </FlatButton>
        </View>
      </View>

        <View style={loginContainerStyles.bottomContainer}>
        </View>

      </View>
    )
  }
}

EmailBasedLoginScene.propTypes = {
  processLoginAction: React.PropTypes.func,
  status: React.PropTypes.string
}

const matchDispatchToProps = (dispatch) => {
  return({
    processLoginAction: bindActionCreators(processLoginAction, dispatch)
  })
}

export default connect(null, matchDispatchToProps)(EmailBasedLoginScene);
