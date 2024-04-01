import request from "@/utils/request";

export function getAllResourceApi() {
    return request.get('/resource/')
}
