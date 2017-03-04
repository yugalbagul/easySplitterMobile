import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { View, Text, TouchableOpacity } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { Actions } from 'react-native-router-flux';
import { ROUTES } from '../../constants';
import { LoginProviders } from '../../constants';
import { firebaseAuth, fbProvider } from '../../../config/firebase/firebaseConfig';
import { scoialLoginStyle as styles, loginContainerStyles } from './styles';
import { processLoginAction } from '../../actions/loginActions';

class LoginScene extends React.Component {
  constructor(){
    super();
    this.loginWithFacebook = this.loginWithFacebook.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
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

  goToLogin(type){
    Actions[ROUTES.emailLoginPage]({ status: type });
  }

  render() {
    return (
      <View style={loginContainerStyles.container}>
        <View style={loginContainerStyles.topContainer}>
            <Text style={styles.appNameText}>
              Easy Splitter
            </Text>
        </View>
        <View style={loginContainerStyles.middleContainer}>
        <View style={styles.loginTextContainer}>
          <TouchableOpacity onPress={this.goToLogin.bind(this, 'login')}>
            <View>
            <Text style={styles.loginText}>
                Sign In with email
            </Text>
          </View>
        </TouchableOpacity>
        </View>
        <View style={styles.orComponentContinaer}>
          <View style={styles.lineContainer}>
          </View>
          <View>
            <Text style={{ color: 'black'}}>
              OR
            </Text>
          </View>
          <View style={styles.lineContainer}>
          </View>

        </View>
        <View style={styles.fbButtonContainer}>
          <LoginButton
            readPermissions={['email','public_profile','user_friends']}
            onLoginFinished={this.loginWithFacebook}
            onLogoutFinished={() => alert('logout.')}
            loginBehaviorAndroid={'native_with_fallback'}
            style={styles.fbButtonStyle}
          />
        </View>
        <TouchableOpacity onPress={this.goToLogin.bind(this, 'signup')}>
        <Text style={styles.registerText}>
          New User ? Register Now
        </Text>
      </TouchableOpacity>
      </View>

        <View style={loginContainerStyles.bottomContainer}>

        </View>
      </View>
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
