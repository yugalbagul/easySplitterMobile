const calculatorFunction = (type, ...args) => {
  switch (type) {
  case 'DISH_PRICE_CHANGE':{
    const currentGrossPrice = args[0] * args[1]; // totalprice
    const tempCurrentDishSplit = args[3];
    const newBaseSplitAmount = currentGrossPrice / args[2]; // new base split count
    tempCurrentDishSplit.map((userSplitInfo) => {
      userSplitInfo.dishAmount = parseFloat(userSplitInfo.splitPortion) * newBaseSplitAmount;
    })
    if(args[4] === 'count'){
      return{
        currentDishSplit: tempCurrentDishSplit,
        currentDishCount: args[0],
        currentBaseSplitAmount: newBaseSplitAmount
      }
    } else {
      return{
        currentDishSplit: tempCurrentDishSplit,
        currentPricePerItem: args[1],
        currentBaseSplitAmount: newBaseSplitAmount
      };
    }
  }
  case 'USER_PORTION_CHANGED':
    return userPortionChanged(args);
  case 'USER_SELECTION_ADDED':
    return userSelectionAdded(args);
  case 'USER_SELECTION_REMOVED':
    return userSelectionRemoved(args);
  default:

  }
}

const userSelectionRemoved = ([ index, people, state ]) => {
  const tempCurrentDishSplit = state.currentDishSplit;
  const { currentDishCount, currentPricePerItem } = state;

  tempCurrentDishSplit[index].selected = false;
  // calculate new splits after removing this person
  let newTotalSplits = 0;
  tempCurrentDishSplit.map((userSplitInfo) => {
    if(userSplitInfo.selected && userSplitInfo.splitPortion && userSplitInfo.splitPortion !== '0'){
      newTotalSplits = newTotalSplits + parseFloat(userSplitInfo.splitPortion);
    }
  });

  const newBaseSplitAmount = (currentDishCount * currentPricePerItem) / newTotalSplits;

  tempCurrentDishSplit.map((userSplitInfo) => {
    if(userSplitInfo.selected && userSplitInfo.splitPortion && userSplitInfo.splitPortion !== '0'){
      userSplitInfo.dishAmount = parseFloat(userSplitInfo.splitPortion) * newBaseSplitAmount;
    } else {
      userSplitInfo.dishAmount = 0
    }
  })
  return {
    currentDishSplit: tempCurrentDishSplit,
    currentTotalSplits: newTotalSplits,
    currentBaseSplitAmount: newBaseSplitAmount,
  }
}

const userSelectionAdded = ([ index, people, state ]) => {
  const tempCurrentDishSplit = state.currentDishSplit;
  const personInfo = people[index];
  const userSplitPresent = tempCurrentDishSplit.findIndex((record) => record.userID === personInfo.userID);
  if(userSplitPresent !== -1){
    const { currentDishCount, currentPricePerItem } = state;

    tempCurrentDishSplit[index].selected = true;
    // calculate new splits after removing this person
    let newTotalSplits = 0;
    tempCurrentDishSplit.map((userSplitInfo) => {
      if(userSplitInfo.selected && userSplitInfo.splitPortion && userSplitInfo.splitPortion !== '0'){
        newTotalSplits = newTotalSplits + parseFloat(userSplitInfo.splitPortion);
      }
    });
    const newBaseSplitAmount = (currentDishCount * currentPricePerItem) / newTotalSplits;

    tempCurrentDishSplit.map((userSplitInfo) => {
      if(userSplitInfo.selected && userSplitInfo.splitPortion && userSplitInfo.splitPortion !== '0'){
        userSplitInfo.dishAmount = userSplitInfo.splitPortion * newBaseSplitAmount;
      } else {
        userSplitInfo.dishAmount = 0
      }
    })
    return {
      currentDishSplit: tempCurrentDishSplit,
      currentTotalSplits: newTotalSplits,
      currentBaseSplitAmount: newBaseSplitAmount,
    }
  }
  else {
    const tempDishSplitRecord = {
      userID: personInfo.userID,
      splitPortion: '',
      dishAmount: 0,
      selected: true
    }
    tempCurrentDishSplit.push(tempDishSplitRecord);
    return {
      currentDishSplit: tempCurrentDishSplit,
    }
  }

}

const userPortionChanged = ([ newInputText, index, state ]) => {
  const { currentTotalSplits, currentPricePerItem, currentDishCount } =  state;
  const newInputFloat = parseFloat(newInputText);
  const tempCurrentDishSplit = state.currentDishSplit;
  const tempUserSplitRecord = tempCurrentDishSplit[index];
  // calculate the previous value of the user's portion
  const previousValue = (!tempUserSplitRecord.splitPortion && tempUserSplitRecord.previousSplitPortion ?
    tempUserSplitRecord.previousSplitPortion : tempUserSplitRecord.splitPortion);
  if(tempUserSplitRecord.previousSplitPortion){
    delete tempUserSplitRecord.previousSplitPortion;
  }
  // calculate renewed total splits of the dish into people
  const newTotalSplits = currentTotalSplits + (newInputFloat - previousValue); // new split count

  const newBaseSplitAmount = (currentPricePerItem * currentDishCount) / newTotalSplits; // new base split count

  tempUserSplitRecord.splitPortion = newInputFloat;
  tempCurrentDishSplit[index] = tempUserSplitRecord;
  tempCurrentDishSplit.map((userSplitInfo) => {
    if(userSplitInfo.selected){
      if(userSplitInfo.splitPortion){
        userSplitInfo.dishAmount = userSplitInfo.splitPortion * newBaseSplitAmount;
      } else {
        userSplitInfo.dishAmount = 0;
      }
    }
  })
  // if user types 1. , . is removed in parseFloat, we need to let it get typed
  tempCurrentDishSplit[index].splitPortion = newInputText;

  return {
    currentDishSplit: tempCurrentDishSplit,
    currentTotalSplits: newTotalSplits,
    currentBaseSplitAmount: newBaseSplitAmount,
  }
}

export default calculatorFunction;
