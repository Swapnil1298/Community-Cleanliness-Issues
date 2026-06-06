const DEFAULT_GOOGLE_CLIENT_ID =
  '710103371246-262arva004v78f07londq0e78e60bi1h.apps.googleusercontent.com';

export const googleClientId =
  process.env.GOOGLE_CLIENT_ID ||
  process.env.VITE_GOOGLE_CLIENT_ID ||
  DEFAULT_GOOGLE_CLIENT_ID;
