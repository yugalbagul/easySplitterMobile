import { StyleSheet } from 'react-native';

export const billBasicInfo =  StyleSheet.create({
  container:{
  },
  billInfoContainer:{
    flexDirection:'row',
    marginTop: 12,
    paddingRight: 12
  },
  billNameImageContainer:{
    flex: 1,
    alignItems:'center',
    justifyContent:'center'
  },
  billNameImageView:{
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#153150',
    padding: 8,

  },
  billNameImage:{
    tintColor:'black'
  },
  billNameTextInutContainer:{
    flex: 5,
  },

  billInfoSecondRow:{
    flexDirection:'row',
    paddingHorizontal: 16
  },
  secondRowCol1:{
    flex:1,
    marginRight: 8,
    flexDirection: 'row'
  },
  billAmountImage:{
    marginTop: 12,
    marginRight: 5
  },
  amountTextField:{
    color: '#276191' ,
    textAlign: 'right',
    flex: 1,
    marginTop: 12
  },
  secondRowCol2:{
    flex: 1,
    marginLeft: 8,
    flexDirection: 'row',
  },
  dateConntainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 12
  },
  billDateIcon:{
    color: 'black',
    marginRight: 3
  },
  dateCompnentContainer: {
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    flex: 4,
    paddingTop: 3
  },
  dateComponentStyle:{
    color: '#276191',
  }

})
