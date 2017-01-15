import React from 'react'
import { Navigator } from 'react-native';
import LoginContainer from './components/LoginContainer'
import BillSplitScene from './modules/BillSplitScreen/BillSplitScene';
import DishSplitScene from './modules/DishSplitScreen/DishSplitScene';
import DashboardScene from './modules/DashBoardScreen/DashboardScene';
import LoginScene from './modules/LoginScreen/LoginScene';
import { ROUTES } from './constants';

export default class ESNavigator extends React.Component {
  render() {
    return (
      <Navigator
        initialRoute= {{ title: 'Login', index: 0, routeName: ROUTES.loginPage}}
        renderScene={(route, navigator) => {
          switch(route.routeName){
          case ROUTES.loginPage :
            return <LoginScene navigator={navigator}/>
          case ROUTES.dashBoard :
            return <DashboardScene navigator={navigator}/>
          case ROUTES.billSplitPage:
            return <BillSplitScene navigator={navigator} {...route} />
          case ROUTES.dishSplitPage:
            return <DishSplitScene navigator={navigator} {...route} />
          default:
            return <LoginContainer />
          }

        }
       }
      />
    )
  }
}
