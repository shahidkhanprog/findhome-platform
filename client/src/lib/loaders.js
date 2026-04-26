import apiRequest from "./apiRequest"

export const singlePropertyLoader = async ({request, params }) => {
  const res =  await apiRequest.get(`/posts/${params.id}`);
  return res.data;
}

// 

export const profilePageLoader = async () => {
  const chatPromise = apiRequest("/chats");

  return({
    chatRespone: chatPromise,
  })
}