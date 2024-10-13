<!--
 * @author: gaoweixuan
 * @since: 2024-09-25
-->
<!-- SSO客户端管理 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import BTable from '@/components/Table/BTable/index.vue'
import SearchContainerBox from '@/components/SearchContainerBox/index.vue'
import { deleteSsoClient, exportExcel, page } from '@/api/auth/ssoClient'
import type { SsoClientQuery, SsoClientRecord, SsoClientRecords } from '@/api/auth/ssoClient/type.ts'
import { TableInfo } from '@/components/Table/types/types.ts'
import AddOrEdit from './components/SsoClientAddOrEdit.vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'SsoClient',
  inheritAttrs: false,
})

const { t } = useI18n()
const ssoClientQueryFormRef = ref(ElForm)
const ssoClientAddOrEditRef = ref()

// 查询条件
const queryParams = reactive<SsoClientQuery>({
  clientCode: '',
  current: 1,
  size: 10,
})

let checkedRows = reactive<string[]>([])
let currentRow = reactive<SsoClientRecord>({})

const tableInfo = reactive<TableInfo>({
  // 刷新标识
  refresh: 1,
  tableIndex: true,
  // 选择框类型
  select: 'single',
  // 表格顶部按钮
  tbHeaderBtn: [
    {
      type: 'primary',
      label: t('common.add'),
      permission: ['auth:ssoClient:create'],
      event: 'add',
      icon: 'add',
      eventHandle: () => handleAdd(),
    },
    {
      type: 'danger',
      label: t('common.delete'),
      permission: ['auth:ssoClient:delete'],
      event: 'delete',
      icon: 'delete',
      // 单选返回的是object
      eventHandle: (row: SsoClientRecord) => handleDelete([row]),
    },
  ],
  // 表格字段配置
  fieldList: [
    {
      prop: 'registerClientCode',
      showOverflowTooltip: true,
      label: t('ssoClient.fields.registerClientCode'),
    },
    {
      prop: 'clientCode',
      showOverflowTooltip: true,
      label: t('ssoClient.fields.clientCode'),
    },
    {
      prop: 'clientName',
      showOverflowTooltip: true,
      label: t('ssoClient.fields.clientName'),
    },
    {
      prop: 'redirect',
      showOverflowTooltip: true,
      label: t('ssoClient.fields.redirect'),
    },
    {
      prop: 'back',
      showOverflowTooltip: true,
      label: t('ssoClient.fields.back'),
    },
  ],
  handleBtn: {
    width: 210,
    label: t('common.operate'),
    link: true,
    btList: [
      // 编辑
      {
        label: t('common.edit'),
        type: 'success',
        icon: 'edit',
        event: 'edit',
        permission: ['auth:ssoClient:modify'],
        eventHandle: (row: SsoClientRecord) => handleUpdate(row),
      },
      // 查看
      {
        label: t('common.info'),
        type: 'warning',
        icon: 'view',
        event: 'view',
        permission: ['auth:ssoClient:info'],
        eventHandle: (row: SsoClientRecord) => handleInfo(row),
      },
      // 删除
      {
        label: t('common.delete'),
        type: 'danger',
        icon: 'delete',
        event: 'delete',
        permission: ['auth:ssoClient:delete'],
        eventHandle: (row: SsoClientRecord) => handleDelete([row] as SsoClientRecords),
      },
    ],
  },
})

/**
 * 刷新表格
 */
const reloadList = () => {
  tableInfo.refresh = Math.random()
}

/**
 * 重置查询
 */
const resetQuery = () => {
  ssoClientQueryFormRef.value.resetFields()
  handleQuery()
}

/**
 * 查询
 */
const handleQuery = () => {
  reloadList()
}

/**
 * 添加或者修改
 *
 * @param id 主键
 */
const AddOrEditHandle = (id?: number) => {
  ssoClientAddOrEditRef.value.init(id)
}

/**
 * 详情
 *
 * @param row 参数
 */
const handleInfo = (row: any) => {
  console.log(row)
}

/**
 * 添加
 */
const handleAdd = () => {
  AddOrEditHandle()
}

/**
 * 删除
 *
 * @param rows 行数据
 */
const handleDelete = async (rows: SsoClientRecords) => {
  const ssoClientIds = rows.map((item: any) => item.id)
  await deleteSsoClient(ssoClientIds)
  ElMessage.success({
    message: `${t('common.delete') + t('common.success')}`,
    duration: 1000,
    onClose: () => {
      reloadList()
    },
  })
}

/**
 * 修改
 *
 * @param row 修改参数
 */
const handleUpdate = (row: SsoClientRecord) => {
  AddOrEditHandle(row.id)
}

/**
 * 选中行，设置当前行currentRow
 *
 * @param row 选择的行数据
 */
const handleSelectionChange = (row: SsoClientRecord) => {
  currentRow = row
  console.log(currentRow)
}
</script>

<template>
  <search-container-box>
    <el-form ref="ssoClientQueryFormRef" :model="queryParams" :inline="true">
      <!-- 客户端编码 -->
      <el-form-item :label="t('ssoClient.fields.clientCode')" prop="clientCode">
        <el-input
          @keyup.enter="handleQuery"
          style="width: 200px"
          :placeholder="t('ssoClient.fields.clientCode')"
          v-model="queryParams.clientCode"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">
          {{ t('common.search') }}
        </el-button>
        <el-button type="success" :icon="Refresh" @click="resetQuery">
          {{ t('common.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
  </search-container-box>

  <b-table
    ref="ssoClientTableRef"
    :export-api="exportExcel"
    :list-api="page"
    :tableIndex="tableInfo.tableIndex"
    :query="queryParams"
    :default-sort="tableInfo.defaultSort"
    :refresh="tableInfo.refresh"
    :field-list="tableInfo.fieldList"
    :tb-header-btn="tableInfo.tbHeaderBtn"
    :select="tableInfo.select"
    :checked-rows="checkedRows"
    :handle-btn="tableInfo.handleBtn"
    @selection-change="handleSelectionChange"
  />

  <!-- 新增 / 修改 Dialog -->
  <add-or-edit ref="ssoClientAddOrEditRef" @reload-data-list="reloadList" />
</template>
