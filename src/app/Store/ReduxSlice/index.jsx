import { combineReducers } from "redux";
import scrollReducer from './scrollSlice'
import modalReducer from './modalSlice'
import dropdownReducer from './dropdownSlice'
import userDataReducer from './userSlice'
export default combineReducers({

    scroll:scrollReducer,
    modal: modalReducer,
    dropdown: dropdownReducer,
    userData:userDataReducer,
})