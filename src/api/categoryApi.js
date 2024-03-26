import request from "@/utils/request";

export function getCategoryPageApi(data) {
    return request.post('/category/page', data)
}