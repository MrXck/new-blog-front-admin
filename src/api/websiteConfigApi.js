import request from "@/utils/request";

export function getWebsiteConfigApi() {
    return request.get('/websiteConfig/all')
}

export function updateApi(data) {
    return request.put('/websiteConfig/update', data)
}
