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
