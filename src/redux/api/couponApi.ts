
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const couponApi = createApi({
    reducerPath: "couponApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/coupons" }),
    endpoints: (builder) => ({
        getCoupons: builder.query({
            query: () => "/",
        }),
    }),
});

export const { useGetCouponsQuery } = couponApi;
