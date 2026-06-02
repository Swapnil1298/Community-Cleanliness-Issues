const DEFAULT_AVATAR = 'https://i.ibb.co/2Z3p8wN/default-user.png';

export const resolveMediaUrl = (url) => {
  if (!url) {
    return DEFAULT_AVATAR;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const apiBase = import.meta.env.VITE_API_URL || '/api';
  const serverOrigin = apiBase.replace(/\/api\/?$/, '');
  return `${serverOrigin}${url.startsWith('/') ? url : `/${url}`}`;
};

export { DEFAULT_AVATAR };
