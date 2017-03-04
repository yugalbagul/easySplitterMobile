import { StyleSheet } from 'react-native';

export const loginContainerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topContainer:{
    flex:1,
    justifyContent:'center'
  },
  middleContainer:{
    flex: 3,
  },
  bottomContainer:{
    flex:1,
    justifyContent: 'center'
  },
})

export const scoialLoginStyle = StyleSheet.create({

  appNameText:{
    fontSize: 32,
    color: '#15435B',
  },

  loginTextContainer:{
    flex:1,
    alignSelf:'center',
    justifyContent:'flex-end'
  },
  loginText:{
    fontSize: 18,
    color: '#3991CE'
  },
  orComponentContinaer:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  lineContainer:{
    flex: 1,
    height:1,
    backgroundColor: '#979797',
    marginHorizontal: 8
  },
  fbButtonContainer:{
    flex:1,
  },

  fbButtonStyle:{
    width: 200,
    height: 30,
  },
  registerText:{
    fontSize: 18,
    color: '#003051'
  }
})

export const emailLoginStyle = StyleSheet.create({

  appNameText:{
    fontSize: 32,
    color: '#15435B',
  },
  nameContainer:{
    flex: 1,
    justifyContent:'center'
  },
  emailContainer: {
    flex: 1,
  },
  passwordContainer: {
    flex: 1,

  },
  buttonContainer:{
    flex: 1
  },
  cancelContainer:{
    flex: 1
  }
})
