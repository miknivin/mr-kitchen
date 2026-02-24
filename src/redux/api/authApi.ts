import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userApi } from "./userApi";
import { orderApi } from "./orderApi";
import { logoutUser } from "../slices/userSlice";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/auth",
        credentials: "include",
    }),
    endpoints: (builder) => ({
        register: builder.mutation<any, any>({
            query(body) {
                return {
                    url: "/register",
                    method: "POST",
                    body,
                };
            },
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(authApi.util.resetApiState());
                    dispatch(userApi.util.resetApiState());
                    dispatch(orderApi.util.resetApiState());
                    await dispatch(userApi.endpoints.getMe.initiate(undefined));
                } catch (error) {
                    console.error("Register Error:", error);
                }
            },
        }),
        login: builder.mutation<any, any>({
            query(body) {
                return {
                    url: "/login",
                    method: "POST",
                    body,
                };
            },
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(authApi.util.resetApiState());
                    dispatch(userApi.util.resetApiState());
                    dispatch(orderApi.util.resetApiState());
                    await dispatch(userApi.endpoints.getMe.initiate(undefined));
                } catch (error) {
                    console.error("Login Error:", error);
                }
            },
        }),
        googleLogin: builder.mutation<any, any>({
            query(body) {
                return {
                    url: "/google",
                    method: "POST",
                    body,
                };
            },
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(authApi.util.resetApiState());
                    dispatch(userApi.util.resetApiState());
                    dispatch(orderApi.util.resetApiState());
                    await dispatch(userApi.endpoints.getMe.initiate(undefined));
                } catch (error) {
                    console.error("Google Login Error:", error);
                }
            },
        }),
        logout: builder.mutation<any, void>({
            query: () => ({
                url: "/logout",
                method: "GET",
            }),
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(authApi.util.resetApiState());
                    dispatch(userApi.util.resetApiState());
                    dispatch(orderApi.util.resetApiState());
                    dispatch(logoutUser());
                } catch (error) {
                    console.error("Logout Error:", error);
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGoogleLoginMutation,
    useLogoutMutation,
} = authApi;
