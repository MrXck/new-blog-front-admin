import request from "@/utils/request";

export function getPhotoAlbumByPageApi(data) {
    return request.post('/photoAlbum/page', data)
}

export function deletePhotoAlbumByIdApi(id) {
    return request.delete('/photoAlbum/' + id)
}

export function addPhotoAlbumApi(data) {
    return request.post('/photoAlbum/insert', data)
}

export function updatePhotoAlbumApi(data) {
    return request.put('/photoAlbum/update', data)
}
