const BASE_URL = "https://upskilling-egypt.com:3000/api/v0";

export const IMG_BASE_URL="https://upskilling-egypt.com:3000"

const PORTAL_AUTH_URL = `${BASE_URL}/portal/users`;

export const PORTAL_AUTH_ENDPOINTS = {
  LOGIN: `${PORTAL_AUTH_URL}/login`,
  REGISTER: `${PORTAL_AUTH_URL}`,
  FORGOT_PASSWORD: `${PORTAL_AUTH_URL}/forgot-password`,
  RESET_PASSWORD: `${PORTAL_AUTH_URL}/reset-password`,
  CHANGE_PASSWORD: `${PORTAL_AUTH_URL}/change-password`,
  GET_USER: `${PORTAL_AUTH_URL}/me`,
  PROFILE:(id:string)=>`${PORTAL_AUTH_URL}/${id}`
};

const PORTAL_BOOKING_URL = `${BASE_URL}/portal/booking`;

export const PORTAL_BOOKING_ENDPOINTS = {
  createBooking:`${PORTAL_BOOKING_URL}`,
  GETALLBOOKING:`${PORTAL_BOOKING_URL}/my`,
  pay:(id:string)=>`${PORTAL_BOOKING_URL}/${id}/pay`
};

// ads
const PORTAL_ADS_URL = `${BASE_URL}/portal/ads`;
export const PORTAL_ADS_ENDPOINTS = {
  getAds: `${PORTAL_ADS_URL}`,
  getAdsDetails:(id:string)=>`${PORTAL_ADS_URL}/${id}`
};

// room
const PORTAL_ROOMS_URL = `${BASE_URL}/portal/rooms`;
export const PORTAL_ROOMS_ENDPOINTS = {
  getRooms: `${PORTAL_ROOMS_URL}/available`,
  getRoomDetails: (id: string) => `${PORTAL_ROOMS_URL}/${id}`,
};
// comment
const PORTAL_COMMENT_URL = `${BASE_URL}/portal/room-comments`;
export const PORTAL_COMMENT_ENDPOINTS = {
  createComment: `${PORTAL_COMMENT_URL}`,
  getComment: (roomId: string) => `${PORTAL_COMMENT_URL}/${roomId}`
};
// review
const PORTAL_REVIEW_URL = `${BASE_URL}/portal/room-reviews`;
export const PORTAL_REVIEW_ENDPOINTS = {
  createReview: `${PORTAL_REVIEW_URL}`,
  getReview: (roomId: string) => `${PORTAL_REVIEW_URL}/${roomId}`
};
// Favourite
const PORTAL_FAVOURITE_URL = `${BASE_URL}/portal`;
export const PORTAL_FAVOURITE_ENDPOINTS = {
  addFavourite: `${PORTAL_FAVOURITE_URL}/favorite-rooms`,
  getFavourite: `${PORTAL_FAVOURITE_URL}/favorite-rooms`,
};


// admin
export const BASE_AUTH_ADMIN = `${BASE_URL}/admin/users`
export const AUTH_ADMIN = `${BASE_URL}/admin`

export const AUTH_ADMIN_ENDPOINTS = {
  LOGIN: `${BASE_AUTH_ADMIN}/login`,
  FORGOT_PASSWORD: `${BASE_AUTH_ADMIN}/forgot-password`,
  RESET_PASSWORD: `${BASE_AUTH_ADMIN}/reset-password`,
  CHANGE_PASSWORD: `${BASE_AUTH_ADMIN}/change-password`,
  GET_USER: `${BASE_AUTH_ADMIN}/me`,
  Booking: `${AUTH_ADMIN}/booking`,
  CHART: `${AUTH_ADMIN}/dashboard`,
  getAllusers:`${BASE_AUTH_ADMIN}`
}


const BASE_ROOM_ADMIN = `${BASE_URL}/admin/rooms`;

export const ROOM_ADMIN_ENDPOINTS = {
  getRooms: BASE_ROOM_ADMIN,
  createRooms: BASE_ROOM_ADMIN,
  facility: "https://upskilling-egypt.com:3000/api/v0/admin/room-facilities",
  delete: (id: string) => `${BASE_ROOM_ADMIN}/${id}`, // استخدام ${id} بدلاً من $(id)
  edit:(id:string)=>`${BASE_ROOM_ADMIN}/${id}`,
  view:(id:string)=>`${BASE_ROOM_ADMIN}/${id}`
};
const BASE_ADS_ADMIN = `${BASE_URL}/admin/ads`;

export const ADS_ADMIN_ENDPOINTS = {
  getAds: BASE_ADS_ADMIN,
  createAds: BASE_ADS_ADMIN,
  facility: "https://upskilling-egypt.com:3000/api/v0/admin/room-facilities",
  delete: (id: string) => `${BASE_ADS_ADMIN}/${id}`, // استخدام ${id} بدلاً من $(id)
  view: (id: string) => `${BASE_ADS_ADMIN}/${id}`, // استخدام ${id} بدلاً من $(id)
  update: (id: string) => `${BASE_ADS_ADMIN}/${id}`, // استخدام ${id} بدلاً من $(id)
};
// booking
const BASE_BOOKING_ADMIN = `${BASE_URL}/admin/booking`;

export const BOOKING_ADMIN_ENDPOINTS = {
  getBooking: BASE_BOOKING_ADMIN,
  delete: (id: string) => `${BASE_BOOKING_ADMIN}/${id}`, // استخدام ${id} بدلاً من $(id)
  view: (id: string) => `${BASE_BOOKING_ADMIN}/${id}`, // استخدام ${id} بدلاً من $(id)
};

