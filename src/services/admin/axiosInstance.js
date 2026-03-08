const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "/api/v1"
    : "https://e-shop-1-m034.onrender.com/api/v1");

const toQueryString = (params = {}) => {
  const search = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          search.append(key, String(item));
        }
      });
      return;
    }

    search.append(key, String(value));
  });

  const query = search.toString();
  return query ? `?${query}` : "";
};

async function request(path, { method = 'GET', body, headers = {}, params } = {}) {
  const url = `${BASE_URL}${path}${toQueryString(params)}`;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const defaultHeaders = isFormData ? {} : { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const finalHeaders = { ...defaultHeaders, ...authHeader, ...(headers || {}) };

  const opts = { method, headers: finalHeaders };
  if (body !== undefined) {
    opts.body = isFormData ? body : JSON.stringify(body);
  }

  const res = await fetch(url, opts);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }
    const err = new Error(res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

const axiosInstance = {
  get: (path, opts = {}) => request(path, { method: 'GET', headers: opts.headers, params: opts.params }),
  post: (path, body, opts = {}) => request(path, { method: 'POST', body, headers: opts.headers, params: opts.params }),
  put: (path, body, opts = {}) => request(path, { method: 'PUT', body, headers: opts.headers, params: opts.params }),
  patch: (path, body, opts = {}) => request(path, { method: 'PATCH', body, headers: opts.headers, params: opts.params }),
  delete: (path, opts = {}) => request(path, { method: 'DELETE', headers: opts.headers, params: opts.params }),
};

export default axiosInstance;