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
  },

// PaidByModal styles
  paidByModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  paidByModalInnerContainer: {
    borderRadius: 10,
    alignItems: 'flex-start',
    padding: 20,
    width: 300,
    minHeight: 300,
    backgroundColor: '#fff',

  },
  paidByModalList: {
  },
  paidByModalListItem:{
    padding: 10,
  },

// MultiplePaidByModal


})

export const multiplePaidByModalStyles = StyleSheet.create({
  container:{
  },
  remainingAmount:{
  },
  scrollView:{
    borderTopWidth: StyleSheet.hairlineWidth
  },
  personRow:{
    flexDirection:'row',
    justifyContent:'space-around',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
})
