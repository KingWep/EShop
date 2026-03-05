// adminUploadService.js
import api from "./axiosInstance"

export const uploadImage = (formData) =>
  api.post("/files/upload", formData, {
    headers: {
      // Let the browser set the Content-Type boundary for FormData
    }
  })