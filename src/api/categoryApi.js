import request from "@/utils/request";

export function getCategoryPageApi(data) {
    return request.post('/category/page', data)
}

export function deleteCategoryByIdApi(id) {
    return request.delete('/category/' + id)
}

export function addCategoryApi(data) {
    return request.post('/category/add', data)
}

export function updateCategoryApi(data) {
    return request.put('/category/update', data)
}
