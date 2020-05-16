import { hideLoading, showLoading } from "react-redux-loading-bar";
import { store } from "./store";

export const showLoadingBar = () => store.dispatch(showLoading());
export const hideLoadingBar = () => store.dispatch(hideLoading());
