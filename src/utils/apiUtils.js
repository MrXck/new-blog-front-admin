import request from "@/utils/request";

export function loginApi(data) {
    return request.post("/user/login", data)
}

export function registerApi(data) {
    return request.post("/user/register", data)
}

export function getArticlesByPageApi(data) {
    return request.post("/article/admin/page", data)
}

export function deleteArticleByIdApi(id) {
    return request.delete(`/article/${id}`)
}

export function getArticleByIdApi(id) {
    return request.get(`/article/${id}`)
}

export function addArticleApi(data) {
    return request.post("/article/add", data)
}

export function updateArticleByIdApi(data) {
    return request.put("/article/update", data)
}

export function uploadImageApi(formData, config = {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
}) {
    return request.post("/file/uploadImage", formData, config)
}

export function getCategoryPageApi(data) {
    return request.post('/category/page', data)
}

export function getAllTagApi() {
    return request.get('/tag/all')
}

export function getArticleTagApi(id) {
    return request.get(`/articleTag/${id}`)
}

export function saveArticleTagApi(data) {
    return request.post(`/articleTag/save`, data)
}

