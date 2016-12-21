import { List } from 'immutable';

const initialState = new List([
  {
    id: 0,
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



 export default function (state = initialState, action) {
   return state;
 }
