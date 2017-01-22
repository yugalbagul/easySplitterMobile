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
  },
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
})
