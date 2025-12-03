import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const aboutApi = createApi({
  reducerPath: 'aboutApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getAboutData: builder.query({
      query: () => 'about',
    }),
  }),
});

export const { useGetAboutDataQuery } = aboutApi;
