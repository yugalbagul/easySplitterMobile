import { StyleSheet } from 'react-native';

export const styles  = StyleSheet.create({
  container: {
    flex:1,
  },
  // Bill info styles
  billInfo:{
    borderBottomWidth: 1,
    padding:10,
    flexDirection:'column',
    alignItems:'stretch'
  },
  billInfoName: {
  },
  billInfoBillName:{
    fontSize: 14,
    height: 40
  },
  currentBillAmount: {
    fontSize: 14,
    height: 40,
    color: '#276191',
    fontFamily: 'Gotham Medium'
  },

//action container styles
  actionsContainer:{
    flexDirection:'row',
    justifyContent:'flex-end',
    borderBottomWidth:1,
    padding: 5
  },
  addNewItemText: {
    color:'blue'
  },

  // list styles
  list : {
    flex: 1,
    padding: 5
  },
  item : {
    flex:1,
    minHeight: 50,
    marginBottom: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black'
  }
})
