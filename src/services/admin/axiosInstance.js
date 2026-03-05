const BASE_URL = "https://e-shop-1-m034.onrender.com/api/v1";

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const url = `${BASE_URL}${path}`;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const defaultHeaders = isFormData ? {} : { 'Content-Type': 'application/json' };
  const finalHeaders = { ...defaultHeaders, ...(headers || {}) };

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
    const err = new Error(res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

const axiosInstance = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body, opts = {}) => request(path, { method: 'POST', body, headers: opts.headers }),
  put: (path, body, opts = {}) => request(path, { method: 'PUT', body, headers: opts.headers }),
  patch: (path, body, opts = {}) => request(path, { method: 'PATCH', body, headers: opts.headers }),
  delete: (path, opts = {}) => request(path, { method: 'DELETE', headers: opts.headers }),
};

export default axiosInstance;