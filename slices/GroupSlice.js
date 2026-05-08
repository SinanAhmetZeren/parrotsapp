import { apiSlice } from "../api/apiSlice";

export const groupApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGroup: builder.mutation({
      query: (dto) => ({
        url: "/api/Group",
        method: "POST",
        body: dto,
      }),
      transformResponse: (response) => response,
    }),
    addGroupMember: builder.mutation({
      query: ({ groupId, userId, requesterId }) => ({
        url: `/api/Group/${groupId}/add/${userId}?requesterId=${requesterId}`,
        method: "POST",
      }),
      transformResponse: (response) => response,
    }),
    removeGroupMember: builder.mutation({
      query: ({ groupId, userId, requesterId }) => ({
        url: `/api/Group/${groupId}/remove/${userId}?requesterId=${requesterId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response,
    }),
    exitGroup: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: `/api/Group/${groupId}/exit/${userId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response,
    }),
    getGroupMessages: builder.query({
      query: ({ groupId, userId }) =>
        `/api/Group/${groupId}/messages/${userId}`,
      transformResponse: (response) => response,
    }),
    getGroupById: builder.query({
      query: ({ groupId, userId }) =>
        `/api/Group/${groupId}?userId=${userId}`,
      transformResponse: (response) => response,
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateGroupMutation,
  useAddGroupMemberMutation,
  useRemoveGroupMemberMutation,
  useExitGroupMutation,
  useGetGroupMessagesQuery,
  useGetGroupByIdQuery,
} = groupApiSlice;
