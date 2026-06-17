import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/user";
import otpSlice from "./auth-slice/otpSlice";
import brandSlice from "./product/brandSlice";
import bikeSlice from "./product/bikeSlice";
import partSlice from "./product/partsSlice";
import cartSlice from "./cart/cartSlice";
import orderSlice from "./order/orderSlice";
import paymentSettingsSlice from "./order/paymentSettingsSlice";
import couponSlice from "./order/couponSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    otp: otpSlice,
    brand: brandSlice,
    bike: bikeSlice,
    parts: partSlice,
    cart: cartSlice,
    order: orderSlice,
    paymentSettings: paymentSettingsSlice,
    coupon: couponSlice,
  },
});

export default store;
