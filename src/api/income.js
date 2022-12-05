import request from '@/utils/request'

export function FetchIncomeDetail() {
  return request({
    url: '/api/query/incomedetaillist', // 假地址 自行替换
    method: 'get'
  })
}
