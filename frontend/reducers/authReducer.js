const authReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case 'AUTH':
      return { ...state, data: action?.payload };
    case 'LOGOUT':
      return { ...state, data: null };
    case 'UPDATE_PROFILE':
      return { ...state, data: { ...state.data, user: action?.payload } };
    default:
      return state
  }
};
export default authReducer