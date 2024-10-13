/**
 * @author: gaoweixuan
 * @since: 2023-11-12
 */
import { PageQuery, ResponseData } from '@/types/types.ts'

/**
 * 平台列表类型声明
 */
export interface SsoClientRecord {
  id?: number
  registerClientCode?: string
  clientCode?: string
  clientName?: string
  redirect?: string
  back?: string
}

/**
 * 平台列表数组类型声明
 */
export type SsoClientRecords = SsoClientRecord[]

/**
 * 平台列表接口响应类型声明
 */
export interface SsoClientResponseData extends ResponseData {
  data: {
    records: SsoClientRecords | SsoClientRecord
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 平台列表查询类型声明
 */
export interface SsoClientQuery extends PageQuery {
  clientCode?: string
}

/**
 * 平台表单类型声明
 */
export interface SsoClientForm {
  id?: number
  registerClientCode?: string
  clientCode?: string
  clientName?: string
  redirect?: string
  back?: string
}
