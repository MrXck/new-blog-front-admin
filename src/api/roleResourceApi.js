import request from "@/utils/request";

export function getResourceByRoleIdApi(id) {
    return request.get(`/roleResource/resource/${id}`)
}
