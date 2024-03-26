import request from "@/utils/request";

export function getPhotoPageApi(data) {
    return request.post('/photo/page', data)
}

export function deletePhotoByIdApi(id) {
    return request.delete('/photo/' + id)
}