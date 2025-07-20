const chatReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_CHATS':
      return action?.payload
    case 'ADD_CHAT':
      return [...state, action?.payload]
    case 'MARK_AS_READ':
      return state.map((chat) => ({ ...chat, isRead: true }));
    default:
      return state
  }
};
export default chatReducer