const calculatorFunction = (type, ...args) => {
  switch (type) {
  case 'DISH_PRICE_CHANGE':{
    const currentGrossPrice = args[0]; // totalprice
    const tempCurrentDishSplit = args[2];
    const newBaseSplitAmount = currentGrossPrice / args[1]; // new base split count
    tempCurrentDishSplit.map((userSplitInfo) => {
      userSplitInfo.dishAmount = parseFloat(userSplitInfo.splitPortion) * newBaseSplitAmount;
    })
    return{
      currentDishSplit: tempCurrentDishSplit,
      currentDishTotalPrice: args[0],
      currentBaseSplitAmount: newBaseSplitAmount
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

const userSelectionRemoved = ([ index, state ]) => {
  const tempCurrentDishSplit = state.currentDishSplit;
  const { currentDishTotalPrice } = state;
  tempCurrentDishSplit[index].selected = false;
  // calculate new splits after removing this person
  let newTotalSplits = 0;
  tempCurrentDishSplit.map((userSplitInfo) => {
    if(userSplitInfo.selected && userSplitInfo.splitPortion && userSplitInfo.splitPortion !== '0'){
      newTotalSplits = newTotalSplits + parseFloat(userSplitInfo.splitPortion);
    }
  });

  const newBaseSplitAmount = (parseFloat(currentDishTotalPrice)) / newTotalSplits;

  tempCurrentDishSplit.map((userSplitInfo) => {
    if(userSplitInfo.selected && userSplitInfo.splitPortion && userSplitInfo.splitPortion !== '0'){
      userSplitInfo.dishAmount = parseFloat(userSplitInfo.splitPortion) * newBaseSplitAmount;
    } else {
      userSplitInfo.dishAmount = 0
    }
  });
  return {
    currentDishSplit: tempCurrentDishSplit,
    currentTotalSplits: newTotalSplits,
    currentBaseSplitAmount: newBaseSplitAmount,
  }
}

const userSelectionAdded = ([ id, people, state ]) => {
  const tempCurrentDishSplit = state.currentDishSplit;
  const personInfo = people.find((item) => item.id == id);
  let userSplitIndex = tempCurrentDishSplit.findIndex((record) => record.id === id);
  if(userSplitIndex === -1){
    const tempDishSplitRecord = {
      id: personInfo.id,
      splitPortion: '',
      dishAmount: 0,
      selected: true
    }
    userSplitIndex = (tempCurrentDishSplit.push(tempDishSplitRecord) - 1);

  }
  const { currentDishTotalPrice } = state;

  tempCurrentDishSplit[userSplitIndex].selected = true;
  tempCurrentDishSplit[userSplitIndex].splitPortion = '1';
  // calculate new splits after removing this person
  let newTotalSplits = 0;
  tempCurrentDishSplit.map((userSplitInfo) => {
    if(userSplitInfo.selected && userSplitInfo.splitPortion && userSplitInfo.splitPortion !== '0'){
      newTotalSplits = newTotalSplits + parseFloat(userSplitInfo.splitPortion);
    }
  });
  const newBaseSplitAmount = (parseFloat(currentDishTotalPrice)) / newTotalSplits;

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
  // else {
  //   const tempDishSplitRecord = {
  //     id: personInfo.id,
  //     splitPortion: '',
  //     dishAmount: 0,
  //     selected: true
  //   }
  //   tempCurrentDishSplit.push(tempDishSplitRecord);
  //   return {
  //     currentDishSplit: tempCurrentDishSplit,
  //   }
  // }

}

const userPortionChanged = ([ newInputText, index, state ]) => {
  const { currentTotalSplits, currentDishTotalPrice} =  state;
  const newInputFloat = newInputText ? parseFloat(newInputText) : 0;
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

  const newBaseSplitAmount = (parseFloat(currentDishTotalPrice)) / newTotalSplits; // new base split count

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
