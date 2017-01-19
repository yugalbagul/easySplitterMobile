import { StyleSheet } from 'react-native';

export const styles  = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#F5F7FA',

  },
  sceneContent:{
    flex: 1
  },
  // Bill info styles
  gradientContainer:{
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userThumbnailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userThumbnail:{
    borderColor: '#1D7AA2',
    width: 55,
    height: 55,
    borderRadius: 30,
    borderWidth: 1
  },
  currentUserPendingBar: {
    flexDirection: 'row',
  },

  //action container styles
  actionsContainer:{
    height:30,
    flexDirection:'row',
    justifyContent:'flex-end',
    borderBottomWidth:1,
    padding: 5

  },
  addNewItemText: {
    color:'blue'
  },


  //  List view style
  list : {
    flex: 1,
    marginTop: 30,
    paddingHorizontal: 8,
  },


  // loading indicator
  loadingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
})

export const billCardStyle = StyleSheet.create({
  outerContainer : {
    flex:1,
    minHeight: 75,
    elevation: 2,
    marginBottom: 12,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  billCardCol1:{

  },
  billCardCol2:{

  },
  billCardCol3:{

  },
  dateStyle:{
    fontSize: 11, color: '#757575',
    marginTop: 3
  },
  billNameStyle:{
    fontSize: 17,
    color: '#003150'
  },
  totalBillAmountStyle:{
    color: '#1D7AA2',
    fontSize: 16
  },
  smallTextStyle:{
    fontSize: 11,
    color: '#757575',
    textAlign: 'right',
    marginBottom: 3
  },
  yourAmountStyle:{
    fontSize: 16,
    textAlign: 'right'

  }
})
