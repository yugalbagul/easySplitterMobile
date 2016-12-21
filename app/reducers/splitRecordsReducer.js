import { Map } from 'immutable';

const initialState = new Map({
  0 : {
    splitRecordID: 0,
    billID: 0,
    dishSplitMap: {
      0 : {
        dishID: 0,
        baseSplitAmount: 100,
        totalSplits: 2,
        totalPrice: 200,
        dishSplit: [
          {
            userID: 1,
            splitPortion: 1,
            dishAmount: 100,
          },
          {
            userID: 2,
            splitPortion: 1,
            dishAmount: 100,
          },
        ]
      }
    }
  }
})

export default function(state=initialState, action) {

  return state;
}
