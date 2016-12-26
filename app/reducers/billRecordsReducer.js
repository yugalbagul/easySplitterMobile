import { List } from 'immutable';
import { SAVE_DISH_SPLIT, CANCEL_DISH_SPLIT } from '../actionTypes'

const initialState = new List([
  {
    billID: 0,
    restaurantName: 'Leon Grill',
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
        userID: 1,
        name: 'Yugal'
      },
      {
        userID: 2,
        name: 'Saurbh'
      },
      {
        userID: 3,
        name: 'Kunal'
      },
    ],
  }])

const saveDishInfo = (state, action) => {
  console.log(action);
  const { billRecordIndex, dishInfo } = action;
  const billRecord = state.get(billRecordIndex.toString());
  const newDishesArray = billRecord.dishes;
  const dishIndex = newDishesArray.findIndex((dish) => dish.dishID === dishInfo.dishID);
  if(dishIndex !== -1){
    newDishesArray[dishIndex] = dishInfo;
  } else {
    newDishesArray.push(dishInfo);
  }
  billRecord.dishes = newDishesArray;
  const newState = state.set(billRecordIndex.toString(), billRecord)
  console.log(newState.toJS());
  return newState;
}

export default function (state = initialState, action) {
  switch (action.type) {
  case SAVE_DISH_SPLIT:
    return saveDishInfo(state,action);
  default:
    return state;
  }
}
