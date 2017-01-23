import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container:{
    marginTop: 16,
    paddingLeft: 12,
    paddingRight: 16
  },
  addNewContainer:{
    paddingVertical: 10,
    flexDirection: 'row'
  },

  rowItemImageOuterView:{
    flex: 2
  },

  rowItemImageContainer:{
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:36,
    height: 36,
    borderColor: '#153150'
  },

  addNewItemImage:{
    color: '#303030'
  },
  addNewItemTextContainer:{
    flex: 10,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },

  addNewItemText:{
    color:'#3991CE'
  },

  listContainer:{
  },


  saveButtonContainer:{

  }
})

export const dishInfoStyle = StyleSheet.create({
  dishRowContainer:{
    flexDirection:'row',
    paddingVertical: 8
  },
  imageOuterView:{
    flex: 2
  },

  imageContainer:{
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:36,
    height: 36,
    borderColor: '#153150'
  },
  dishItemImage:{
    width: 24,
    height: 24,
    tintColor: '#FF9600'
  },
  dishItemInfoContainer:{
    flex: 10,
    alignItems: 'flex-start',
  },

  nameAmountContainer:{
    flexDirection: 'row',
  },
  nameContainer:{
    flex: 6
  },
  amountContainer:{
    flex: 1,
    alignItems:'flex-end'
  },
  nameTextStyle:{

  },
  amountTextStyle:{
    fontSize: 14,
    fontWeight: '600',
    color: '#303030'
  },
})
