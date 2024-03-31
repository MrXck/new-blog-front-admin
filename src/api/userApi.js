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