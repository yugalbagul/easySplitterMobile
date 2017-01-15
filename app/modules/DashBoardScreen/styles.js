import { StyleSheet } from 'react-native';

export const styles  = StyleSheet.create({
  container: {
    flex:1,
  },
  sceneContent:{
    flex: 1
  },
  // Bill info styles
  personInfo:{
    borderBottomWidth: 1,
    padding:10
  },
  personInfoName: {
  },
  personInfoUserName:{
    fontSize: 20,
  },

  //action container styles
  actionsContainer:{
    height:30,
    flexDirection:'row',
    justifyContent:'flex-end',
    borderBottomWidth:1,
    padding: 5

  },
  addNewItemText: {
    color:'blue'
  },


  //  List view style
  list : {
    flex: 1
  },
  item : {
    flex:1,
    minHeight: 50,
    marginBottom: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black'

  },

  // loading indicator
  loadingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
})
