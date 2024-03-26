import request from "@/utils/request";

export function getArticleTagApi(id) {
    return request.get(`/articleTag/${id}`)
}

export function saveArticleTagApi(data) {
    return request.post(`/articleTag/save`, data)
}