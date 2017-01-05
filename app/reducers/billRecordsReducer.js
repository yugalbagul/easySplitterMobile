import { Map } from 'immutable';
import { SAVE_DISH_SPLIT, ADD_NEW_BILL, CHANGE_BILL_NAME, CHANGE_BILL_AMOUNT } from '../actions/actionTypes'

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
  default:
    return state;
  }
}
