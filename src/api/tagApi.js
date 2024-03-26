import request from "@/utils/request";

export function getAllTagApi() {
    return request.get('/tag/all')
}