export const ROUTES = {
  home : 'HOMESCENE',
  billSplitPage: 'BILLSPLITPAGE',
  dishSplitPage: 'DISHSPLITPAGE',
  loginPage: 'LOGINPAGE',
  friendsPage: 'FRIENDSPAGE',
  notificationsPage: 'NOTIFICATIONSPAGE',
  userProfilePage: 'USERPROFILEPAGE'
}

export const bottomNavTabs = [
  {
    routeName: 'HOMESCENE',
    active: false,
    icon:'home'
  },
  {
    routeName: 'FRIENDSPAGE',
    active: false,
    icon:'people-outline'
  },
  {
    routeName: 'BILLSPLITPAGE',
    active: false,
    icon:'add-box'
  },
  {
    routeName: 'NOTIFICATIONSPAGE',
    active: false,
    icon:'notifications'
  },
  {
    routeName: 'USERPROFILEPAGE',
    active: false,
    icon:'account-circle'
  }
]

export const LoginProviders = {
  facebook: 'FACEBOOK',
  google: 'GOOGLE',
  firebase: 'FIREBASE',
}


export const validationRegEx = {
  email : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  name: /^[a-zA-Z ]+$/
}

export const users = {
  '-KaCRbWF3UkLPXEMuXVh': 'yugal',
  '-KaCUV0Uqm1y1venQp80': 'saub',
  '-KaCV0FhdvzCdvJQX9WwL': 'kua'
}
