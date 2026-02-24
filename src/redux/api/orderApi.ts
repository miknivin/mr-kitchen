
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/orders", credentials: "include" }),
    tagTypes: ["Order"],
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: "/createOrder",
                method: "POST",
                body: orderData,
            }),
            invalidatesTags: ["Order"],
        }),
        getOrdersByUser: builder.query({
            query: () => "/getOrdersByUser",
            transformResponse: (response: any) => response.orders,
            providesTags: ["Order"],
        }),
        getAllOrders: builder.query({
            query: () => "/all",
            transformResponse: (response: any) => response.orders,
            providesTags: ["Order"],
        }),
        getOrderDetails: builder.query({
            query: (id) => `/${id}`,
            transformResponse: (response: any) => response.order,
            providesTags: ["Order"],
        }),
        updateOrder: builder.mutation({
            query: ({ id, orderData }) => ({
                url: `/${id}`,
                method: "PUT",
                body: orderData,
            }),
            invalidatesTags: ["Order"],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrdersByUserQuery,
    useGetAllOrdersQuery,
    useGetOrderDetailsQuery,
    useUpdateOrderMutation,
} = orderApi;
