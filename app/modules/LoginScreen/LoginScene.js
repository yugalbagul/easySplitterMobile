import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { View, Button, Text, ScrollView } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Hideo } from 'react-native-textinput-effects';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { LoginProviders, validationRegEx } from '../../constants';
import { firebaseAuth, fbProvider } from '../../../config/firebase/firebaseConfig';
import { styles } from './styles';
import { processLoginAction } from '../../actions/loginActions';

class LoginScene extends React.Component {
  constructor(){
    super();
    this.state = {
      email: 'saurabh29@gmail.com',
      emailError: '',
      password: 'password',
      passwordError: '',
      loading: false,
      signupFormFlag : false,
    }
    this.loginWithFacebook = this.loginWithFacebook.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onSignup = this.onSignup.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
  }

  loginWithFacebook(error, result) {
    const { props: { processLoginAction } } = this
    if (error) {
      processLoginAction({ error: result.error, provider: LoginProviders.facebook, navigator: this.props.navigator })
    } else if (result.isCancelled) {

    } else {
      AccessToken.getCurrentAccessToken().then(
        (data) => {
          const credential = fbProvider.credential(data.accessToken);
          return firebaseAuth.signInWithCredential(credential);
        }
      ).then((userdata) => {
        processLoginAction({ userData: userdata, provider: LoginProviders.facebook, navigator: this.props.navigator })
      })
      .catch(err => {
        processLoginAction({ error: err, provider: LoginProviders.firebase, navigator: this.props.navigator })
      })
    }
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

  onSignup(){
    const { signupFormFlag } = this.state;
    if(signupFormFlag){
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
          this.props.processLoginAction({ userData: userdata, provider: LoginProviders.firebase, navigator: this.props.navigator })
        }).catch(err => {
          this.props.processLoginAction({ error: err, provider: LoginProviders.firebase, navigator: this.props.navigator })
        })

      }
    } else {
      this.setState({
        signupFormFlag: true
      });
    }
  }

  onLogin() {
    const { signupFormFlag } = this.state;
    if(!signupFormFlag){
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
          this.props.processLoginAction({ userData: userdata, provider: LoginProviders.firebase, navigator: this.props.navigator })
        }).catch(err => {
          console.log(err);
          this.props.processLoginAction({ error: err, provider: LoginProviders.firebase, navigator: this.props.navigator })
        })
      }
    } else {
      this.setState({
        signupFormFlag: false
      });
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {this.state.signupFormFlag ?
        <View style={styles.credsContainer}>
          <Hideo
            iconClass={FontAwesomeIcon}
            iconName={'user'}
            iconColor={'white'}
            iconBackgroundColor={'grey'}
            inputStyle={{ color: '#464949' }}
            value={this.state.name}
            onChange={(event) => {this.setState({ name: event.nativeEvent.text, nameError:'' })}}
            onEndEditing= {this.validateName}
            keyboardType={'email-address'}
          />
      </View> : null }
        {this.state.nameError && this.state.signupFormFlag?
          <View style={styles.emailError}>
            <View style={{alignSelf: 'flex-start'}}>
              <Text >{this.state.nameError}</Text>
            </View>
          </View>: null}
        <View style={styles.credsContainer}>
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
        {this.state.emailError ?
          <View style={styles.emailError}>
            <View style={{alignSelf: 'flex-start'}}>
              <Text >{this.state.emailError}</Text>
            </View>
          </View>: null}
        <View style={styles.credsContainer}>
          <Hideo
            iconClass={FontAwesomeIcon}
            iconName={'lock'}
            iconColor={'white'}
            iconBackgroundColor={'grey'}
            inputStyle={{ color: '#464949' }}
            value={this.state.password}
            onChange={(event) => {this.setState({ password: event.nativeEvent.text, passwordError:'' })}}
            onEndEditing= {this.validatePassword}
            secureTextEntry={true}
          />
        </View>
        {this.state.passwordError ?
          <View style={styles.emailError}>
            <View style={{alignSelf: 'flex-start'}}>
              <Text >{this.state.passwordError}</Text>
            </View>
          </View>: null}
        <View style={styles.loginButton}>
          <Button
            onPress={this.onSignup}
            title={ this.state.signupFormFlag? 'Sign Up' : '<< Sign Up ' }
            color={'green'}
          />

          <Button
            onPress={this.onLogin}
            title={ this.state.signupFormFlag? 'Login  >>' : 'Login' }
            color={'grey'}
          />

        </View>
        <View style={{marginTop: 10}}>
          <Text style={{ color: 'black'}}>
            OR
          </Text>
        </View>
        <View style={styles.fbButtonContainer}>
          <LoginButton
            readPermissions={['email','public_profile','user_friends']}
            onLoginFinished={this.loginWithFacebook}
            onLogoutFinished={() => alert('logout.')}/>
        </View>

      </ScrollView>
    )
  }
}

LoginScene.propTypes = {
  processLoginAction: React.PropTypes.func,
  navigator: React.PropTypes.object
}

const matchDispatchToProps = (dispatch) => {
  return({
    processLoginAction: bindActionCreators(processLoginAction, dispatch)
  })
}

export default connect(null, matchDispatchToProps)(LoginScene);
