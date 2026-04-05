import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../pages/Auth/stores/authSlice";
import doctorReducer from "../pages/Doctor/stores/doctorSlice";
import patientReducer from "../pages/Patient/stores/patientSlice";
import postReducer from "../pages/Doctor/stores/postSlice";
import sliderReducer from "./slices/sliderSlice";
import ecommerceReducer from "./slices/ecommerceSlice";
import chatReducer from "../shared/stores/chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
    patient: patientReducer,
    post: postReducer,
    slider: sliderReducer,
    ecommerce: ecommerceReducer,
    chat: chatReducer,
  },
});
