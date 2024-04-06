import request from "@/utils/request";

export function loginApi(data) {
    return request.post("/user/login", data, {
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    })
}

export function registerApi(data) {
    return request.post("/user/register", data)
}

export function getUserByPageApi(data) {
    return request.post('/user/page', data)
}

export function deleteUserByIdApi(id) {
    return request.delete('/user/' + id)
}

export function updateUserApi(data) {
    return request.put('/user/update', data)
}

export function updateUserDisableApi(id, disable) {
    return request.get(`/user/disable/${id}/${disable}`)
}

export function getOnlineUserByPageApi(data) {
    return request.post(`/user/online/page`, data)
}

export function offlineUserByIdApi(id) {
    return request.delete(`/user/offline/${id}`)
}
