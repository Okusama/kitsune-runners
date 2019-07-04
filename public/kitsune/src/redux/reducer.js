import {combineReducers} from "redux";
import userReducer from "./reducers/userReducer";
import runReducer from "./reducers/runReducer";
import timerReducer from "./reducers/timerReducer";

const rootReducer = combineReducers({
    user: userReducer,
    run: runReducer,
    timer: timerReducer
});

export default rootReducer;