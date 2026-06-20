const BASE_URL = 'https://ezhcelufziyodev.pythonanywhere.com/api/v1'

function getHeaders() {
  const token = localStorage.getItem('access_token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

async function request(path, options = {}, auth = true) {
  const isFormData = options.body instanceof FormData
  const baseHeaders = auth ? getHeaders() : { 'Content-Type': 'application/json' }
  if (isFormData) delete baseHeaders['Content-Type']

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...baseHeaders, ...options.headers },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))

    // Token yaroqsiz bo'lsa — tokensiz qayta yuboramiz
    if (res.status === 401 && err.code === 'token_not_valid' && auth) {
      const retryHeaders = { 'Content-Type': 'application/json' }
      if (isFormData) delete retryHeaders['Content-Type']
      const retry = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: { ...retryHeaders, ...options.headers },
      })
      if (retry.status === 204) return null
      return retry.json()
    }

    throw Object.assign(new Error(err.detail || 'Request failed'), { status: res.status, data: err })
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  // Auth (no token needed)
  login: (data) => request('/auth/login/', { method: 'POST', body: JSON.stringify(data) }, false),
  register: (data) => request('/auth/register/', { method: 'POST', body: JSON.stringify({ ...data, otp_type: 'otp' }) }, false),
  verifyOtp: (data) => request('/auth/register/otp/verify/', { method: 'POST', body: JSON.stringify(data) }, false),
  resendOtp: (otpType, data) => request(`/auth/resend/${otpType}/`, { method: 'POST', body: JSON.stringify(data) }, false),

  // Music
  getMusics: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/user/music/${query ? '?' + query : ''}`)
  },
  getMusicDetail: (id) => request(`/user/music/detail/${id}/`),
  createMusic: (formData) => request('/user/music/create/', { method: 'POST', body: formData }),
  updateMusic: (id, formData) => request(`/user/music/update/${id}/`, { method: 'PATCH', body: formData }),
  deleteMusic: (id) => request(`/user/music/delete/${id}/`, { method: 'DELETE' }),

  // Playlists
  getPlaylists: (params = '') => request(`/user/playlist/${params}`),
  getPlaylistDetail: (id) => request(`/user/playlist/detail/${id}/`),
  createPlaylist: (formData) => request('/user/playlist/create/', { method: 'POST', body: formData }),
  updatePlaylist: (id, formData) => request(`/user/playlist/update/${id}/`, { method: 'PATCH', body: formData }),
  deletePlaylist: (id) => request(`/user/playlist/delete/${id}/`, { method: 'DELETE' }),

  // Favourites
  getFavourites: () => request('/user/favourite/'),
  addFavourite: (data) => request('/user/favourite/create/', { method: 'POST', body: JSON.stringify(data) }),
  removeFavourite: (id) => request(`/user/favourite/delete/${id}/`, { method: 'DELETE' }),

  // Favourite playlists
  getFavouritePlaylists: () => request('/user/favourite-playlist/'),
  addFavouritePlaylist: (data) => request('/user/favourite-playlist/create/', { method: 'POST', body: JSON.stringify(data) }),
  removeFavouritePlaylist: (id) => request(`/user/favourite-playlist/delete/${id}/`, { method: 'DELETE' }),
}
