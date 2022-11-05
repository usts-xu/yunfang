import request from '@/utils/request'
export function fetchApiList(data){
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

export function updateApi(data) {
  return request({
    url: '/api/api_manager/updateconfig',
    method: 'post',
    data
  })
}

export function fetchTactic(data) {
  return request({
    url: '/api/tactic/queryconfig',
    method: 'post',
    data
  })
}

export function updateTactic(data) {
  return request({
    url: '/api/tactic/updatetactic',
    method: 'post',
    data
  })
}

export function fetchUsertactic(data) {
  return request({
    url: '/api/tactic/get_user_tactic',
    method: 'post',
    data
  })
}

export function updataUsetTactic(data) {
  console.log(data)
  return request({
    url: '/api/tactic/update_user_tactic',
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
