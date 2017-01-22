import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container:{
  },
  triggerContainer:{
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 16,
    marginTop: 14
  },
  triggerContainerIcon:{
    color: '#353535',
  },
  triggerContainerNamesList:{
    flexDirection:'row',
    flex: 9,
    backgroundColor: '#fbf9f7',
    borderColor: '#E0E0E0',
    flexWrap: 'wrap',
    paddingVertical: 4,
    elevation: 0.8
  },
  triggerContainerItemContainer:{
    paddingHorizontal: 3,
    alignSelf:'flex-end'
  },
  triggerContainerNamesListItem:{
    color:'#353535',
    fontSize: 16
  },
  addNewUserContainer: {
  },
  newUserForm:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  formIconContainer: {
    flex: 1,
    alignSelf:'flex-start',
    marginTop: 10
  },
  formEmailContainer:{
    flex: 10
  },
  emailErrorContainer:{
    marginTop: 2
  },

  emailTextField:{
    color: '#353535',
    flex: 1,
    marginTop: 12
  },
  personRow:{
    flexDirection:'row',
  },
  personCheckBox: {

  },
  personDisplayName: {
    color: '#353535',
  },
  newPersonForm:{
    padding: 5,
    borderBottomWidth: 1,
  }
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
