
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['About', 'Activities', 'Videos', 'Gallery', 'Projects', 'Timeline', 'Faq', 'Contacts', 'Profile', 'Settings', 'Countries', 'States', 'Cities', 'Clients', 'Games', 'Team', 'Designations', 'ActionLogs', 'Analytics', 'Sports', 'Matches'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    uploadImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: 'upload',
          method: 'POST',
          body: formData,
        };
      },
    }),
    getAnalyticsData: builder.query({
      query: () => 'analytics',
      providesTags: ['Analytics'],
    }),
    getAboutData: builder.query({
      query: () => 'about',
      providesTags: ['About'],
    }),
    updateAboutData: builder.mutation({
      query: (updatedData) => ({
        url: 'about',
        method: 'PUT',
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
    getTimelineData: builder.query({
        query: () => 'timeline',
        providesTags: ['Timeline'],
    }),
    updateTimelineData: builder.mutation({
        query: (updatedData) => ({
            url: 'timeline',
            method: 'POST',
            body: updatedData,
        }),
        invalidatesTags: ['Timeline'],
    }),
    getFaqData: builder.query({
        query: () => 'faq',
        providesTags: ['Faq'],
    }),
    updateFaqData: builder.mutation({
        query: (updatedData) => ({
            url: 'faq',
            method: 'POST',
            body: updatedData,
        }),
        invalidatesTags: ['Faq'],
    }),
    getContacts: builder.query({
      query: () => 'contacts',
      providesTags: ['Contacts'],
    }),
    addContact: builder.mutation({
      query: (newContact) => ({
        url: 'contacts',
        method: 'POST',
        body: newContact,
      }),
      invalidatesTags: ['Contacts'],
    }),
    updateContact: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `contacts/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Contacts'],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `contacts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contacts'],
    }),
    getProfileData: builder.query({
      query: () => 'profile',
      providesTags: ['Profile'],
    }),
    updateProfileData: builder.mutation({
      query: (updatedData) => ({
        url: 'profile',
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: ['Profile'],
    }),
    getSettingsData: builder.query({
      query: () => 'settings',
      providesTags: ['Settings'],
    }),
    updateSettingsData: builder.mutation({
      query: (updatedData) => ({
        url: 'settings',
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: ['Settings'],
    }),
    getCountries: builder.query({
      query: () => 'countries',
      providesTags: ['Countries'],
    }),
    updateCountries: builder.mutation({
      query: (updatedData) => ({
        url: 'countries',
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: ['Countries'],
    }),
     getStates: builder.query({
      query: () => 'states',
      providesTags: ['States'],
    }),
    updateStates: builder.mutation({
      query: (updatedData) => ({
        url: 'states',
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: ['States'],
    }),
     getCities: builder.query({
      query: () => 'cities',
      providesTags: ['Cities'],
    }),
    updateCities: builder.mutation({
      query: (updatedData) => ({
        url: 'cities',
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: ['Cities'],
    }),
    getClientsData: builder.query({
      query: () => 'clients',
      providesTags: ['Clients'],
    }),
    updateClientsData: builder.mutation({
      query: (updatedData) => ({
        url: 'clients',
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: ['Clients'],
    }),
    getGamesData: builder.query({
      query: () => 'games',
      providesTags: ['Games'],
    }),
    updateGamesData: builder.mutation({
      query: (updatedData) => ({
        url: 'games',
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: ['Games'],
    }),
    getTeamData: builder.query({
      query: () => 'team',
      providesTags: ['Team'],
    }),
    updateTeamData: builder.mutation({
      query: (updatedData) => ({
        url: 'team',
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: ['Team'],
    }),
    getDesignations: builder.query({
      query: () => 'designations',
      providesTags: ['Designations'],
    }),
    updateDesignations: builder.mutation({
      query: (updatedData) => ({
        url: 'designations',
        method: 'POST',
        body: updatedData,
      }),
      invalidatesTags: ['Designations'],
    }),
    getActionLogs: builder.query({
      query: () => 'action-logs',
      providesTags: ['ActionLogs'],
    }),
    addActionLog: builder.mutation({
      query: (newLog) => ({
        url: 'action-logs',
        method: 'POST',
        body: newLog,
      }),
      invalidatesTags: ['ActionLogs'],
    }),
    deleteActionLogs: builder.mutation({
      query: (body) => ({
        url: 'action-logs/delete',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['ActionLogs'],
    }),
    getSports: builder.query({
        query: () => 'sports',
        providesTags: ['Sports'],
    }),
    updateSports: builder.mutation({
        query: (updatedData) => ({
            url: 'sports',
            method: 'POST',
            body: updatedData,
        }),
        invalidatesTags: ['Sports'],
    }),
    getSportById: builder.query({
      query: (id) => `sports/${id}`,
      providesTags: (result, error, id) => [{ type: 'Sports', id }],
    }),
    getMatches: builder.query({
        query: () => 'matches',
        providesTags: ['Matches'],
    }),
    getMatchById: builder.query({
        query: (id) => `matches/${id}`,
        providesTags: (result, error, id) => [{ type: 'Matches', id }],
    }),
    addMatch: builder.mutation({
        query: (newMatch) => ({
            url: 'matches',
            method: 'POST',
            body: newMatch,
        }),
        invalidatesTags: ['Matches'],
    }),
    updateMatch: builder.mutation({
        query: ({ _id, ...patch }) => ({
            url: `matches/${_id}`,
            method: 'PATCH',
            body: patch,
        }),
        invalidatesTags: (result, error, { _id }) => [{ type: 'Matches', id: _id }],
    }),
    deleteMatch: builder.mutation({
        query: (id) => ({
            url: `matches/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Matches'],
    }),
  }),
});

export const { 
  useLoginMutation,
  useUploadImageMutation,
  useGetAnalyticsDataQuery,
  useGetAboutDataQuery, 
  useUpdateAboutDataMutation,
  useGetActivitiesDataQuery,
  useUpdateActivitiesDataMutation,
  useGetVideosDataQuery,
  useUpdateVideosDataMutation,
  useGetGalleryDataQuery,
  useUpdateGalleryDataMutation,
  useGetProjectsDataQuery,
  useUpdateProjectsDataMutation,
  useGetTimelineDataQuery,
  useUpdateTimelineDataMutation,
  useGetFaqDataQuery,
  useUpdateFaqDataMutation,
  useGetContactsQuery,
  useAddContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useGetProfileDataQuery,
  useUpdateProfileDataMutation,
  useGetSettingsDataQuery,
  useUpdateSettingsDataMutation,
  useGetCountriesQuery,
  useUpdateCountriesMutation,
  useGetStatesQuery,
  useUpdateStatesMutation,
  useGetCitiesQuery,
  useUpdateCitiesMutation,
  useGetClientsDataQuery,
  useUpdateClientsDataMutation,
  useGetGamesDataQuery,
  useUpdateGamesDataMutation,
  useGetTeamDataQuery,
  useUpdateTeamDataMutation,
  useGetDesignationsQuery,
  useUpdateDesignationsMutation,
  useGetActionLogsQuery,
  useAddActionLogMutation,
  useDeleteActionLogsMutation,
  useGetSportsQuery,
  useUpdateSportsMutation,
  useGetSportByIdQuery,
  useGetMatchesQuery,
  useGetMatchByIdQuery,
  useAddMatchMutation,
  useUpdateMatchMutation,
  useDeleteMatchMutation,
} = contentApi;
