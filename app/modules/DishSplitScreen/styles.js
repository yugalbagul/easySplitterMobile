import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container:{

  },
  dishInfoContainer : {
    flexDirection: 'column',
    paddingVertical: 10,
    marginTop: 8
  },
  dishNameContainer:{
    flexDirection: 'row',
    paddingHorizontal: 16
  },
  dishImageOuterContainer:{
    flex: 1
  },
  dishImageInnerContainer:{
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:36,
    height: 36,
    borderColor: '#153150'
  },

  dishImage:{
    width: 24,
    height: 24,
    tintColor: '#FF9600'
  },
  dishNameInputCotainer:{
    flex: 6
  },
  dishPriceContianer:{
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 16,
    marginTop: 8
  },
  amountIconContainer:{
    flex: 1,
    alignItems:'center'
  },
  amountIconStyle: {
    fontSize: 24,
    color: '#153150'
  },
  amountInputContainer:{
    flex:6
  },

  // share and cost column labels
  columnLabelsContainer:{
    marginBottom: 8
  },
  columnLabelsStyle: {
    textAlign: 'right',
    fontSize: 12,
    color: '#757575'
  },

 // split secton

  dishSplitInfoContainer:{
    marginTop: 16,
    paddingLeft: 12,
    paddingRight: 16
  },
  separatorTextContainer:{
    marginBottom: 16
  },
  separatorText:{
    color: '#757575'
  },
  dishSplitPersonContainer:{
    flexDirection: 'row'
  },
  nameCheckBxContainer:{
    flexDirection: 'row',
    flex: 2
  },
  checkBoxContainer:{
    flex: 1,
    justifyContent:'flex-end',
  },
  personNameContainer:{
    flex: 3,
    justifyContent:'center',
  },
  personNameText:{
    fontSize: 16,
    color: '#303030'
  },
  personShareContainer:{
    flex: 1,
    justifyContent:'center',
    alignItems:'flex-end'
  },
  personDishAmountContainer:{
    flex: 1,
    justifyContent:'center',
    alignItems: 'flex-end'
  },
  personDishAmountText:{
    fontSize: 16,
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
