import request from "@/utils/request";

export function getAllTagApi() {
    return request.get('/tag/all')
}

export function getTagByPageApi(data) {
    return request.post('/tag/page', data)
}

export function deleteTagByIdApi(id) {
    return request.delete('/tag/' + id)
}

export function addTagApi(data) {
    return request.post('/tag/add', data)
}

export function updateTagApi(data) {
    return request.put('/tag/update', data)
}
