import request from "@/utils/request";

export function getAllRoleApi() {
    return request.get('/role/all')
}

export function getRoleByPageApi(data) {
    return request.post('/role/page', data)
}

export function deleteRoleByIdApi(id) {
    return request.delete('/role/' + id)
}

export function addRoleApi(data) {
    return request.post('/role/add', data)
}

export function updateRoleApi(data) {
    return request.put('/role/update', data)
}

export function updateRoleDisableApi(id, isDisable) {
    return request.get(`/role/disable/${id}/${isDisable}`)
}

export function getResourceByRoleIdApi(id) {
    return request.get(`/roleResource/resource/${id}`)
}
