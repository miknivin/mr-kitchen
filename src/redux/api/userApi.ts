import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setLoading, setUser } from "../slices/userSlice";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api",
        credentials: "include",
    }),
    tagTypes: ["User", "AdminUsers"],
    endpoints: (builder) => ({
        getMe: builder.query<any, void>({
            query: () => "/auth/getMe",
            transformResponse: (result: any) => result.user,
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data));
                    dispatch(setIsAuthenticated(true));
                    dispatch(setLoading(false));
                } catch (error) {
                    dispatch(setLoading(false));
                }
            },
            providesTags: ["User"],
        }),
        updateProfile: builder.mutation<any, any>({
            query(body) {
                return {
                    url: "/users/me/update",
                    method: "PUT",
                    body,
                };
            },
            invalidatesTags: ["User"],
        }),
        // Admin endpoints
        getAdminUsers: builder.query<any, void>({
            query: () => "/users",
            providesTags: ["AdminUsers"],
        }),
        getUserDetails: builder.query<any, string>({
            query: (id) => `/users/${id}`,
            providesTags: ["AdminUsers"],
        }),
        updateUser: builder.mutation<any, { id: string; body: any }>({
            query({ id, body }) {
                return {
                    url: `/users/${id}`,
                    method: "PUT",
                    body,
                };
            },
            invalidatesTags: ["AdminUsers"],
        }),
        deleteUser: builder.mutation<any, string>({
            query(id) {
                return {
                    url: `/users/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["AdminUsers"],
        }),
    }),
});

export const {
    useGetMeQuery,
    useUpdateProfileMutation,
    useGetAdminUsersQuery,
    useGetUserDetailsQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApi;
