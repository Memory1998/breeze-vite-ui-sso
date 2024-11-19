/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'

enum API {
  LIST_SSO_CLIENT_URL = '/auth/v1/ssoClient/getHomeSsoClient',
  LOGIN_USER_PIE_URL = '/sys/v1/sysLog/home/statisticLoginUserPie',
}

/**
 * 获取子系统列表
 */
export function getHomeSsoClient(): AxiosPromise<any> {
  return request({
    url: API.LIST_SSO_CLIENT_URL,
    method: 'get',
  })
}

/**
 * 统计登录用户饼图
 */
export function statisticLoginUserPie(): AxiosPromise<any> {
  return request({
    url: API.LOGIN_USER_PIE_URL,
    method: 'get',
  })
}
