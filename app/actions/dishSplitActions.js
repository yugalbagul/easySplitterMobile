import { SAVE_DISH_SPLIT, CANCEL_DISH_SPLIT } from '../actionTypes'

export const saveDishSplitAction = (billRecordIndex, billID, dishInfo, dishSplitInfo, newItem ) => {
    return {
      type: SAVE_DISH_SPLIT,
      dishInfo,
      dishSplitInfo,
      billRecordIndex,
      billID,
      newItem
    }
}

export const cancelDishSplitAction = (data, splitChanged, dishInfoChanged) => {
  return {
    type: CANCEL_DISH_SPLIT,
    data,
    splitChanged,
    dishInfoChanged
  }
}
