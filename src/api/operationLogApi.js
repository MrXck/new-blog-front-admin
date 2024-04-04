import request from "@/utils/request";

export function getOperationLogByPageApi(data) {
    return request.post('/operationLog/page', data)
}

export function deleteOperationLogByIdApi(id) {
    return request.delete('/operationLog/' + id)
}