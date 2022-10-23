import request from '@/utils/request'
export function fetchApiList(data){
  console.log(data)
  return request({
    url: '/api/api_manager/queryconfig',
    method: 'post',
    data
  })
}
export function createApi(data) {
  return request({
    url: '/api/api_manager/addconfig',
    method: 'post',
    data
  })
}

export function fetchList(query) {
  return request({
    url: '/vue/api_manager/querylist',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
