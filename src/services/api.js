import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['About', 'Activities', 'Videos', 'Gallery', 'Projects'],
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
    getVideosData: builder.query({
      query: () => 'videos',
      providesTags: ['Videos'],
    }),
    updateVideosData: builder.mutation({
      query: (updatedData) => ({
        url: 'videos',
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: ['Videos'],
    }),
    getGalleryData: builder.query({
      query: () => 'gallery',
      providesTags: ['Gallery'],
    }),
    updateGalleryData: builder.mutation({
      query: (updatedData) => ({
        url: 'gallery',
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: ['Gallery'],
    }),
    getProjectsData: builder.query({
      query: () => 'projects',
      providesTags: ['Projects'],
    }),
    updateProjectsData: builder.mutation({
      query: (updatedData) => ({
        url: 'projects',
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: ['Projects'],
    }),
  }),
});

export const { 
  useGetAboutDataQuery, 
  useUpdateAboutDataMutation,
  useGetActivitiesDataQuery,
  useUpdateActivitiesDataMutation,
  useGetVideosDataQuery,
  useUpdateVideosDataMutation,
  useGetGalleryDataQuery,
  useUpdateGalleryDataMutation,
  useGetProjectsDataQuery,
  useUpdateProjectsDataMutation
} = contentApi;
