import { combineReducers } from "redux";
import authReducer from "./authReducer";
import chatReducer from "./chatReducer";
import usersReducer from "./usersReducer";

export default combineReducers({
  auth: authReducer,
  chats: chatReducer,
  users: usersReducer
});