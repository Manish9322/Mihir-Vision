import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const aboutApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['About', 'Activities'],
  endpoints: (builder) => ({
    getAboutData: builder.query({
      query: () => 'about',
      providesTags: ['About'],
    }),
    updateAboutData: builder.mutation({
      query: (updatedData) => ({
        url: 'about',
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: ['About'],
    }),
    getActivitiesData: builder.query({
      query: () => 'activities',
      providesTags: ['Activities'],
    }),
    updateActivitiesData: builder.mutation({
      query: (updatedData) => ({
        url: 'activities',
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: ['Activities'],
    }),
  }),
});

export const { 
  useGetAboutDataQuery, 
  useUpdateAboutDataMutation,
  useGetActivitiesDataQuery,
  useUpdateActivitiesDataMutation
} = aboutApi;
