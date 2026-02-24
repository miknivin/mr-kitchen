
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const enquiryApi = createApi({
    reducerPath: "enquiryApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/enquiries" }),
    endpoints: (builder) => ({
        getEnquiries: builder.query({
            query: () => "/",
        }),
        getEnquiryDetails: builder.query({
            query: (id) => `/${id}`,
        }),
        createEnquiry: builder.mutation({
            query: (enquiryData) => ({
                url: "/",
                method: "POST",
                body: enquiryData,
            }),
        }),
    }),
});

export const {
    useGetEnquiriesQuery,
    useGetEnquiryDetailsQuery,
    useCreateEnquiryMutation,
} = enquiryApi;
