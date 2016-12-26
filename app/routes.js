import React from 'react'
import { Navigator } from 'react-native';
import LoginContainer from './components/LoginContainer'
import BillSplitScene from './containers/BillSplitScene';
import DishSplitScene from './containers/DishSplitScene';
import DashboardScene from './containers/DashboardScene';
import { ROUTES } from './constants';

export default class ESNavigator extends React.Component {
  render() {
    return (
      <Navigator
        initialRoute= {{ title: 'Dashboard', index: 0, routeName: ROUTES.dashBoard}}
        renderScene={(route, navigator) => {
          switch(route.routeName){
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
