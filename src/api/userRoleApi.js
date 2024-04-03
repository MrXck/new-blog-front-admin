import request from "@/utils/request";

export function getRoleByUserIdApi(id) {
    return request.get(`/userRole/getByUserId/${id}`)
}