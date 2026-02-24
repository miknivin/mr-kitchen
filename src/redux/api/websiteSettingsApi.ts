
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const websiteSettingsApi = createApi({
    reducerPath: "websiteSettingsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/websiteSettings" }),
    endpoints: (builder) => ({
        getSettings: builder.query({
            query: () => "/",
        }),
        updateSettings: builder.mutation({
            query: (settingsData) => ({
                url: "/",
                method: "PUT",
                body: settingsData,
            }),
        }),
    }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = websiteSettingsApi;
