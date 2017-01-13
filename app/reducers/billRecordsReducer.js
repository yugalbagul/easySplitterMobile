import { Map } from 'immutable';
import { SET_BILL_RECORDS_WITH_SPLIT } from '../actions/actionTypes'

const initialState = new Map({
  0 : {
    id: 0,
    restaurantName: 'Leon Grill',
    billName:'Leon Grill with Kunal',
    totalBillAmount: 360,
    paidBy: 1,
    dishes: [
      {
        dishID: 0,
        dishName: 'Chicken Burger',
        count: 2,
        type: 'NV',
        pricePerItem: 100,
      },
      {
        dishID: 1,
        dishName: 'Veg Burger',
        count: 2,
        pricePerItem: 80,
        type: 'V'
      }
    ],
    people: [
      {
        id: 1,
        name: 'Yugal'
      },
      {
        id: 2,
        name: 'Saurbh'
      },
      {
        id: 3,
        name: 'Kunal'
      },
    ],
  }})




export default function (state = initialState, action) {
  switch (action.type) {
  case SET_BILL_RECORDS_WITH_SPLIT: {
    return state.mergeDeep(action.billRecords);
  }
  default:
    return state;
  }
}
