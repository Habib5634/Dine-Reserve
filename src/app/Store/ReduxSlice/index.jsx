import { combineReducers } from "redux";
import scrollReducer from './scrollSlice'
import modalReducer from './modalSlice'
import dropdownReducer from './dropdownSlice'
export default combineReducers({

    scroll:scrollReducer,
    modal: modalReducer,
    dropdown: dropdownReducer,
})