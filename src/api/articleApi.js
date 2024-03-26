import request from "@/utils/request";

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

export function uploadArticleTopApi(id, isTop) {
    return request.get(`/article/top/${id}/${isTop}`)
}

export function uploadArticleFeaturedApi(id, isTop) {
    return request.get(`/article/featured/${id}/${isTop}`)
}
