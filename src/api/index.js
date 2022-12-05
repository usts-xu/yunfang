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

export function fetchSmarttactic(data) {
  return request({
    url: '/api/tactic/get_user_tactic',
    method: 'post',
    data
  })
}


export function addSmartTactic(data) {
  return request({
    url: '/api/tactic/add_user_tactic',
    method: 'post',
    data
  })
}

export function UpdateSmartTactic(data) {
  console.log(data)
  return request({
    url: '/api/tactic/update_smart_tactic',
    method: 'post',
    data
  })
}


export function UpdateSmartStatus(data) {
  console.log(data)
  return request({
    url: '/api/tactic/update_smart_status',
    method: 'post',
    data
  })
}

export function UpdateIncome(data){
  return request({
    url: '/api/query/queryincome',
    method: 'post',
    data
  })
}
export function ComputeSmart(data){
  return request({
    url: '/api/query/computesmart',
    method: 'post',
    data
  })
}
export function DeleteUserTactic(data){
  return request({
    url: '/api/tactic/delete_user_tactic',
    method: 'post',
    data
  })
}

export function GetHoldCC(data){
  return request({
    url: '/api/query/getholdcc',
    method: 'post',
    data
  })
}

export function InComeDetail(data){
  return request({
    url: '/api/query/incomedetail',
    method: 'post',
    data
  })
}
