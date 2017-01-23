import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import BillBasicInfoContainer from './containers/BillBasicInfo/BillBasicInfoContainer';
import { cancelBillSplitAction  } from '../../actions/billsActions'
import PeopleInvolvedContainer from './containers/PeopleInvolved/PeopleInvolvedContainer';
import PaidByContainer from './containers/PaidBy/PaidByContainer';
import DishListContainer from './containers/DishList/DishListContainer'

class BillSplitScene extends React.Component{
  constructor(){
    super()
    this.state = {
      loadingState: true,
      showDishSplits: false,
    }
    this.cancelBillSplit = this.cancelBillSplit.bind(this);
  }

  cancelBillSplit(){
    this.props.cancelBillSplitAction();
    Actions.pop();
  }

  render() {
    return(

      <View style={styles.container}>
        <Icons.ToolbarAndroid
          title= 'Add Bill'
          style= {{
            backgroundColor: '#18435A',
            height: 56,
            elevation: 10
          }}
          navIconName='close'
          titleColor= '#FFFFFF'
          onIconClicked={this.cancelBillSplit}
        />
        <View style={styles.billInfo}>

          <BillBasicInfoContainer />

          <PeopleInvolvedContainer />

          <PaidByContainer />

        </View>

        <DishListContainer />

    </View>

    )
  }
}

BillSplitScene.propTypes = {
  billRecordID:React.PropTypes.string,
  newBill: React.PropTypes.bool,
  cancelBillSplitAction: React.PropTypes.func

}


const matchDispatchToProps = (dispatch) => {
  return{
    cancelBillSplitAction: bindActionCreators(cancelBillSplitAction, dispatch)
  }
}

export default connect(null, matchDispatchToProps)(BillSplitScene);
