import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  triggerContainer:{
    flexDirection: 'row',
    paddingLeft: 4,
    paddingRight: 16,
    marginTop: 14
  },
  triggerIconContainer:{
    flex:2,
    alignItems: 'center',
    justifyContent:'center',
  },
  triggerIcon:{
    color: '#353535',
    fontSize: 15
  },
  triggerTextContainer:{
    paddingVertical: 4,
    flex: 10,
    backgroundColor: '#fbf9f7',
    elevation: 0.8,
    paddingHorizontal: 4
  },
  triggerText:{
    color:'#353535',
    fontSize: 16
  }
})

export const paidByModalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalInnerContainer:{
    borderRadius: 10,
    alignItems: 'flex-start',
    width: 300,
    minHeight: 300,
    backgroundColor: '#fff',
  },
  headerContainer: {
    borderBottomWidth:1,
    borderColor: 'grey',
    alignSelf:'stretch',
    paddingVertical: 5,
    paddingLeft: 5
  },
  headerTextStyle:{
    color:'#18435A',

  },
  listStyle:{
    marginTop: 5
  },
  itemContainer:{
    flexDirection: 'row'
  },
  listItem:{
    padding: 10,
  }
})
