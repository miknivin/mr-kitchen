import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    tagTypes: ["Product", "AdminProducts"],
    endpoints: (builder) => ({
        getProducts: builder.query<any, any>({
            query: (params) => ({
                url: "/products",
                params: {
                    page: params?.page,
                    keyword: params?.keyword,
                    category: params?.category,
                    limit: params?.limit,
                },
            }),
            transformResponse: (response: any) => ({
                products: response.allProducts || [],
                totalProducts: response.totalProducts,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
            }),
            providesTags: ["Product"],
        }),
        getProductDetails: builder.query<any, string>({
            query: (id) => `/products/${id}`,
            transformResponse: (response: any) => response.product || response.productById,
            providesTags: ["Product"],
        }),
        createProduct: builder.mutation<any, any>({
            query: (productData) => ({
                url: "/products",
                method: "POST",
                body: productData,
            }),
            invalidatesTags: ["AdminProducts"],
        }),
        updateProduct: builder.mutation<any, { id: string; body: any }>({
            query: ({ id, body }) => ({
                url: `/products/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Product", "AdminProducts"],
        }),
        deleteProduct: builder.mutation<any, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AdminProducts"],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;
