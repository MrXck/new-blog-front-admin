import request from "@/utils/request";

export function getAllResourceApi() {
    return request.get('/resource/')
}

export function getResourceByPageApi(data) {
    return request.post('/resource/page', data)
}

export function deleteResourceByIdApi(id) {
    return request.delete('/resource/' + id)
}

export function deleteResourceParentByIdApi(id) {
    return request.delete('/resource/parent/' + id)
}

export function addResourceApi(data) {
    return request.post('/resource/addResource', data)
}

export function addResourceParentApi(data) {
    return request.post('/resource/addResourceParent', data)
}

export function updateResourceApi(data) {
    return request.put('/resource/update', data)
}

export function updateResourceParentApi(data) {
    return request.put('/resource/updateParent', data)
}

export function uploadResourceAnonymousApi(id, anonymous) {
    return request.get(`/resource/anonymous/${id}/${anonymous}`)
}
