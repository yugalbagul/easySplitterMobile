import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import { View, StyleSheet, Dimensions, TouchableNativeFeedback } from 'react-native';
import { bottomNavTabs, ROUTES } from '../constants';
import { addNewBillAction } from '../actions/billsActions'




class BottomNavigation extends React.Component{
  constructor(){
    super()
    this.state = {
      tabsArray : bottomNavTabs
    }
  }

  navigate(tabInfo){
    const self = this;
    const { currentRoute, addNewBillAction } = self.props;
    const { routeName: targetRoute } = tabInfo;
    if(targetRoute !== currentRoute){
      if(targetRoute === ROUTES.billSplitPage){
        addNewBillAction();
        Actions[targetRoute]();
      } else if((currentRoute === ROUTES.billSplitPage) && (targetRoute === ROUTES.home)){
        alert('Showw pop up here');
      } else {
        Actions[targetRoute]();
      }
    }
  }
  render(){
    const { width: screenWidth } = Dimensions.get('window');
    const { props: { currentRoute } } = this;
    const itemWidthClass = { width:(screenWidth / 5)};
    console.log(currentRoute);
    if(currentRoute && currentRoute !== ROUTES.billSplitPage){
      return(
        <View style={styles.container}>
          {this.state.tabsArray.map((tabInfo) => {
            const activeClass = currentRoute === tabInfo.routeName ? { color: '#ffffff'} : {};
            return(
            <TouchableNativeFeedback key={tabInfo.routeName} onPress = {this.navigate.bind(this, tabInfo)}
              background={TouchableNativeFeedback.Ripple('grey')}>
              <View style={[styles.tile,itemWidthClass]}>
                  <MaterialIcons size={24} name={tabInfo.icon} style={[styles.tileIcon, activeClass]}/>
              </View>
            </TouchableNativeFeedback>)
          })}
        </View>
      )
    }
    else {
      return(null)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292B',
    maxHeight: 56,
    flexDirection: 'row'
  },
  tile:{
    alignItems:'center',
    paddingHorizontal: 12,
  },
  tileIcon: {
    color: 'grey',
    paddingVertical: 16
  },

})

const matchStateToProps = (state) => {
  return {
    currentRoute : state.get('navigationReducer').get('currentRoute') ? state.get('navigationReducer').get('currentRoute') : null
  }
}

const matchDispatchToProps = (dispatch) => {
  return{
    addNewBillAction: bindActionCreators(addNewBillAction, dispatch)
  }
}

export default connect(matchStateToProps, matchDispatchToProps)(BottomNavigation);
