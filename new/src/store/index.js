import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../pages/Auth/stores/authSlice";
import doctorReducer from "../pages/Doctor/stores/doctorSlice";
import patientReducer from "../pages/Patient/stores/patientSlice";
import pharmacyReducer from "../pages/Pharmacy/stores/pharmacySlice";
import shippingReducer from "../pages/ShippingCompany/stores/shippingSlice";
import postReducer from "../pages/Doctor/stores/postSlice";
import sliderReducer from "./slices/sliderSlice";
import ecommerceReducer from "./slices/ecommerceSlice";
import chatReducer from "../shared/stores/chatSlice";
import aiAppReducer from "./slices/aiAppSlice";
import aiChatReducer from "./slices/aiChatSlice";
import aiImageReducer from "./slices/aiImageSlice";
import knowledgeReducer from "../pages/public/stores/knowledgeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
    patient: patientReducer,
    pharmacy: pharmacyReducer,
    shipping: shippingReducer,
    post: postReducer,
    slider: sliderReducer,
    ecommerce: ecommerceReducer,
    chat: chatReducer,
    aiApp: aiAppReducer,
    aiChat: aiChatReducer,
    aiImage: aiImageReducer,
    knowledge: knowledgeReducer,
  },
});
