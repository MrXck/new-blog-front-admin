import request from "@/utils/request";

export function uploadImageApi(formData, config = {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
}) {
    return request.post("/file/uploadImage", formData, config)
}

export function uploadImagePhotoApi(formData, config = {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
}) {
    return request.post("/file/uploadImagePhoto", formData, config)
}