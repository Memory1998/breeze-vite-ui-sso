<!--
 * @author: gaoweixuan
 * @since: 2024-09-25
-->

<!-- SSO客户端添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addSsoClient, getSsoClient, editSsoClient, checkSsoClientCode } from '@/api/auth/ssoClient'
import type { SsoClientForm } from '@/api/auth/ssoClient/type.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import useWidth from '@/hooks/dialogWidth'

defineOptions({
  name: 'SsoClientAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const ssoClientDataFormRef = ref()
const ssoClientDataForm = ref<SsoClientForm>({})
const rules = ref({
  clientCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('ssoClient.fields.clientCode'),
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        checkSsoClientCode(
          value,
          !ssoClientDataForm.value.id ? undefined : JSONBigInt.parse(ssoClientDataForm.value.id),
        ).then((response: any) => {
          if (response.data) {
            callback()
            return
          }
          callback(new Error(t('ssoClient.rules.clientCodeExists')))
        })
      },
      trigger: 'blur',
    },
  ],
  clientUrl: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('ssoClient.fields.clientUrl'),
      trigger: 'blur',
    },
  ],
})

/**
 * 初始化
 *
 * @param id
 */
const init = async (id: number) => {
  ssoClientDataForm.value.id = undefined
  visible.value = true
  // 重置表单数据
  if (ssoClientDataFormRef.value) {
    ssoClientDataFormRef.value.resetFields()
  }

  if (id) {
    await getInfo(id)
  }
}

/**
 * 获取信息
 *
 * @param id
 */
const getInfo = async (id: number) => {
  const response: any = await getSsoClient(JSONBigInt.parse(id))
  if (response.code === '0000') {
    Object.assign(ssoClientDataForm.value, response.data)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = () => {
  ssoClientDataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false
    }
    loading.value = true
    const id = ssoClientDataForm.value.id
    if (id) {
      await editSsoClient(id, ssoClientDataForm.value)
      ElMessage.success({
        message: `${t('common.modify') + t('common.success')}`,
        duration: 1000,
        onClose: () => {
          visible.value = false
          loading.value = false
          $emit('reloadDataList')
        },
      })
    } else {
      await addSsoClient(ssoClientDataForm.value)
      ElMessage.success({
        message: `${t('common.save') + t('common.success')}`,
        duration: 1000,
        onClose: () => {
          visible.value = false
          loading.value = false
          $emit('reloadDataList')
        },
      })
    }
  })
}

defineExpose({
  init,
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :width="useWidth()"
    :title="!ssoClientDataForm.id ? t('common.add') : t('common.edit')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="ssoClientDataForm"
      :rules="rules"
      ref="ssoClientDataFormRef"
      @keyup.enter="handleDataFormSubmit()"
      label-width="90px"
    >
      <el-form-item :label="t('ssoClient.fields.clientCode')" prop="clientCode">
        <el-input
          v-model="ssoClientDataForm.clientCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('ssoClient.fields.clientCode')"
        />
      </el-form-item>
      <el-form-item :label="t('ssoClient.fields.clientUrl')" prop="clientUrl">
        <el-input
          v-model="ssoClientDataForm.clientUrl"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('ssoClient.fields.clientUrl')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        @click="
          () => {
            visible = false
            loading = false
          }
        "
      >
        {{ t('common.cancel') }}
      </el-button>
      <el-button type="primary" :loading="loading" @click="handleDataFormSubmit()">{{ t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
