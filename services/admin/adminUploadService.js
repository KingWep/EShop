// adminUploadService.js
import api from "../api"

export const uploadImage = (formData) =>
  api.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })