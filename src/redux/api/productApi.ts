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
            transformResponse: (response: any) => {
                const rawProducts = response.allProducts || [];

                const getProductPriority = (product: any) => {
                    const name = (product.name || "").toLowerCase();
                    const has650ml = (product.variants || []).some((v: any) => {
                        const size = (v.size || "").toLowerCase();
                        return size.includes("650ml") || size.includes("650 ml");
                    }) || name.includes("650ml") || name.includes("650 ml");

                    if (has650ml) return 1;

                    const has2L = (product.variants || []).some((v: any) => {
                        const size = (v.size || "").toLowerCase();
                        return size === "2l" || size === "2 l" || size.includes("2ltr") || size.includes("2 ltr");
                    }) || name.includes("2ltr") || name.includes("2 ltr");

                    if (has2L) return 2;

                    return 3;
                };

                const sortedProducts = [...rawProducts].sort((a: any, b: any) => {
                    return getProductPriority(a) - getProductPriority(b);
                });

                return {
                    products: sortedProducts,
                    totalProducts: response.totalProducts,
                    currentPage: response.currentPage,
                    totalPages: response.totalPages,
                };
            },
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
