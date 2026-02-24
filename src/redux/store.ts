
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./api/authApi";
import { productApi } from "./api/productApi";
import { orderApi } from "./api/orderApi";
import { userApi } from "./api/userApi";
import { couponApi } from "./api/couponApi";
import { enquiryApi } from "./api/enquiryApi";
import { websiteSettingsApi } from "./api/websiteSettingsApi";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [couponApi.reducerPath]: couponApi.reducer,
        [enquiryApi.reducerPath]: enquiryApi.reducer,
        [websiteSettingsApi.reducerPath]: websiteSettingsApi.reducer,
        cart: cartReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            productApi.middleware,
            orderApi.middleware,
            userApi.middleware,
            couponApi.middleware,
            enquiryApi.middleware,
            websiteSettingsApi.middleware
        ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
