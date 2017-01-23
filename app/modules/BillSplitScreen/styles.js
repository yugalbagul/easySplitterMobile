import { StyleSheet } from 'react-native';

export const styles  = StyleSheet.create({
  container: {
    flex:1,
  },
  // Bill info styles
  currentBillAmount: {
    fontSize: 14,
    height: 40,
    color: '#276191',
    fontFamily: 'Gotham Medium'
  },

  // list styles
  list : {
    flex: 1,
    padding: 5
  },

})

export const dishRowStyles = StyleSheet.create({
  item : {
    flex:1,
    minHeight: 50,
    marginBottom: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black'
  },
})

export const multiplePaidByModalStyles = StyleSheet.create({
  container:{
  },
  remainingAmountContainer:{
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  remainingAmountRow1Text:{
    fontWeight: '500',
    color: '#303030'
  },
  remainingAmountRow2Text:{
    color: '#9E9E9E'
  },
  scrollView:{
    marginTop: 8
  },
  personRowContainer:{
    flexDirection:'row',
    paddingVertical: 5,

  },
  nameContainer: {
    flex: 7,
    alignSelf: 'flex-end',
    padding: 8,

  },
  nameTextStyle:{
    fontSize: 16,
    color:'#303030'

  },
  amountContainer: {
    flex: 2,
    alignSelf:'flex-end',
    flexDirection:'row',

  },
  currencyText:{
    fontSize: 16,
    color:'#303030',
  },
  amountTextInput:{

  },
})

export const toolBarStyle = StyleSheet.create({
  titleStyle:{
    fontSize:18,
    color: 'white',
  },
  actionStyle:{
    color: '#2A628F',

  }

})
