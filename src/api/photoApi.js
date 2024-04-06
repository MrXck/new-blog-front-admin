import request from "@/utils/request";

export function getPhotoPageApi(data) {
    return request.post('/photo/page', data)
}

export function deletePhotoByIdApi(id) {
    return request.delete('/photo/' + id)
}

export function updateByPhotoAlbumApi(data) {
    return request.post('/photo/updateByPhotoAlbum', data)
}

export function getByPhotoAlbumIdApi(id, data) {
    return request.post(`/photo/pageByPhotoAlbum/${id}`, data)
}

export function deleteByPhotoAlbumIdApi(data) {
    return request.post(`/photo/deleteByPhotoAlbum`, data)
}