export const getImageIconFromName = (dishInfo) => {
  // For now creating random image
  // TODO: add a logic to generate an image based on image nameContainer
  const modulo = dishInfo.dishID % 5;
  switch (modulo) {
  case 0:
    return require('../../assets/food_icons/burger.png')
  case 1:
    return require('../../assets/food_icons/chicken_grill.png')
  case 2:
    return require('../../assets/food_icons/default.png')
  case 3:
    return require('../../assets/food_icons/gravy.png')
  case 4:
    return require('../../assets/food_icons/default.png')
  default:
    return require('../../assets/food_icons/default.png')
  }
}
