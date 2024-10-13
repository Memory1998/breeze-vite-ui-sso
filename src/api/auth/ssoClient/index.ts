/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import request from '@/utils/request.ts'
import { AxiosPromise } from 'axios'
import { SsoClientResponseData, SsoClientQuery, SsoClientRecord, SsoClientForm } from './type.ts'
import { ResponseData, SelectResponseData } from '@/types/types.ts'

enum API {
  SSO_CLIENT_RESTFUL_URL = '/auth/v1/ssoClient',
  CHECK_SSO_CLIENT_CODE_URL = '/auth/v1/ssoClient/checkSsoClientCode',
  SSO_REGISTER_CLIENT_SELECT_URL = '/sys/v1/common/selectRegisteredClient',
}

/**
 * 列表
 *
 * @param params
 */
export function page(params: SsoClientQuery): AxiosPromise<SsoClientResponseData> {
  return request({
    url: API.SSO_CLIENT_RESTFUL_URL,
    method: 'get',
    params: params,
  })
}

/**
 * 获取详情
 *
 * @param id
 */
export function getSsoClient(id: number): AxiosPromise<SsoClientResponseData> {
  return request({
    url: `${API.SSO_CLIENT_RESTFUL_URL}/info/${id}`,
    method: 'get',
  })
}

/**
 * 添加
 *
 * @param data
 */
export function addSsoClient(data: SsoClientForm): AxiosPromise<ResponseData> {
  return request({
    url: API.SSO_CLIENT_RESTFUL_URL,
    method: 'post',
    data: data,
  })
}

/**
 * 编辑
 *
 * @param id
 * @param data
 */
export function editSsoClient(id: number, data: SsoClientForm): AxiosPromise<ResponseData> {
  return request({
    url: `${API.SSO_CLIENT_RESTFUL_URL}/${id}`,
    method: 'put',
    data: data,
  })
}

/**
 * 删除
 *
 * @param ids
 */
export function deleteSsoClient(ids: number[]): AxiosPromise<ResponseData> {
  return request({
    url: API.SSO_CLIENT_RESTFUL_URL,
    method: 'delete',
    data: ids,
  })
}

/**
 * 导出
 *
 * @param params
 */
export function exportExcel(params: SsoClientRecord): AxiosPromise<any> {
  return request({
    url: API.SSO_CLIENT_RESTFUL_URL,
    method: 'post',
    data: params,
  })
}

/**
 * 校验平台编码是否重复
 *
 *  @param clientCode
 *  @param clientId
 */
export function checkSsoClientCode(clientCode: string, clientId?: number): AxiosPromise<any> {
  return request({
    url: API.CHECK_SSO_CLIENT_CODE_URL,
    method: 'get',
    params: {
      clientId: clientId,
      clientCode: clientCode,
    },
  })
}

/**
 * 注册客户端下拉框
 *
 */
export function selectRegisterClient(): AxiosPromise<SelectResponseData> {
  return request({
    url: API.SSO_REGISTER_CLIENT_SELECT_URL,
    method: 'get',
  })
}
