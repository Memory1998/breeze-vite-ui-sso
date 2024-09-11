/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { PermissionResponseData } from './type'
import { GrantType } from '@/types/types.ts'

enum API {
  AUTH_URL = '/oauth2/token',
  LIST_PERMISSION_URL = '/auth/v1/menu/listTreeMenu',
  LOGOUT_URL = '/logout',
}

/**
 * 获取菜单权限
 *
 * @param i18n 国际化标志
 */
export function listPermission(i18n: string): AxiosPromise<PermissionResponseData> {
  return request({
    url: API.LIST_PERMISSION_URL,
    method: 'get',
    params: {
      platformCode: 'pc',
      i18n: i18n,
    },
  })
}

/**
 * 校验是否登录
 */
export function checkIsLogin(): AxiosPromise<PermissionResponseData> {
  return request({
    url: '/sso/isLogin',
    method: 'get',
  })
}

/**
 * 获取sso地址
 */
export function getSsoAuthUrl(back: string): AxiosPromise<PermissionResponseData> {
  return request({
    url: '/sso/getSsoAuthUrl',
    method: 'get',
    params: { clientLoginUrl: back },
  })
}

/**
 * sso 使用 ticket获取 token
 */
export function doLoginByTicket(ticket: string) {
  return request({
    url: '/sso/doLoginByTicket',
    method: 'get',
    params: {
      ticket: ticket,
    },
  })
}

/**
 * sso 用户信息
 */
export function userInfo() {
  return request({
    url: '/sso/userInfo',
    method: 'get',
  })
}

/**
 * TOKEN刷新
 *
 * @param refreshToken 刷新token
 * @param grantType    登录类型
 */
export const refreshToken = (refreshToken: string, grantType: GrantType) =>
  request.post<any, any>(
    API.AUTH_URL + `?grant_type=${grantType}&refresh_token=${refreshToken}`,
    {},
    {
      headers: {
        Authorization: 'Basic YnJlZXplOmJyZWV6ZQ==',
      },
    },
  )

/**
 * 退出登录
 */
export const logout = () => request.get<any, any>(API.LOGOUT_URL)
