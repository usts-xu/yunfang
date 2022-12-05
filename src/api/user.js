import request from '@/utils/request'

export function login(data) {
  console.log('登录中。。。')
  var a = request({
    url: '/api/login',
    method: 'post',
    data
  })
  return a
}

export function getInfo(token) {
  return request({
    url: '/api/info',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}


export function getRegCode() {
  return request({
    url: '/api/admin/getregcode',
    method: 'get'
  })
}


export function Register(data) {
  return request({
    url: '/api/admin/register',
    method: 'post',
    data
  })
}

export function Fetchalluser() {
  return request({
    url: '/api/admin/fetchalluser',
    method: 'get'
  })
}

export function UpdateVipTime(data) {
  return request({
    url: '/api/admin/updateviptime',
    method: 'post',
    data
  })
}