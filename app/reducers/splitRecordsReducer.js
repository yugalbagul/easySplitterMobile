import { Map } from 'immutable';

const initialState = new Map({
  0: {
    splitRecordID: 0,
    id: 0,
    totalAmountSplit: 200,
    dishSplitMap: {
      0 : {
        dishID: 0,
        baseSplitAmount: 100,
        totalSplits: 2,
        dishSplit: [
          {
            id: 1,
            splitPortion: 1,
            dishAmount: 100,
          },
          {
            id: 2,
            splitPortion: 1,
            dishAmount: 100,
          },
        ]
      }
    }
  }
})



export default function(state=initialState, action) {
  switch (action.type) {
  default:
    return state;
  }
}
