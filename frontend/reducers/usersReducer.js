const usersReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_USERS':
      return action.payload;
    case 'UPDATE_PROFILE':
      return state.map((user) => user._id === action.payload._id ? action.payload : user);
    case 'LOGOUT':
      return [];
    case 'ADD_CHAT':
      return state.map((user) =>
        user._id === action.payload.sender || user._id === action.payload.receiver
          ? { ...user, lastMessage: action.payload }
          : user
      );
    default:
      return state;
  }
};
export default usersReducer;