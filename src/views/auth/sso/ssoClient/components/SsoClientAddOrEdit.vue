<!--
 * @author: gaoweixuan
 * @since: 2024-09-25
-->

<!-- SSO客户端添加修改弹出框 -->
<script lang="ts" setup>
import { ref } from 'vue'
import {
  addSsoClient,
  getSsoClient,
  editSsoClient,
  checkSsoClientCode,
  selectRegisterClient,
} from '@/api/auth/ssoClient'
import type { SsoClientForm } from '@/api/auth/ssoClient/type.ts'
import { SelectData } from '@/types/types.ts'
import { useI18n } from 'vue-i18n'
import JSONBigInt from 'json-bigint'
import useWidth from '@/hooks/dialogWidth'
import { useMessage } from '@/hooks/message'

defineOptions({
  name: 'SsoClientAddOrEdit',
  inheritAttrs: false,
})

const { t } = useI18n()
const $emit = defineEmits(['reloadDataList'])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const registerClientOption = ref<SelectData[]>()
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
  registerClientCode: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('ssoClient.fields.registerClientCode'),
      trigger: 'blur',
    },
  ],
  redirect: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('ssoClient.fields.redirect'),
      trigger: 'blur',
    },
  ],
  back: [
    {
      required: true,
      message: t('common.placeholder.enter') + t('ssoClient.fields.back'),
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
  await initSelectRegisterClient()
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
  try {
    const response: any = await getSsoClient(JSONBigInt.parse(id))
    Object.assign(ssoClientDataForm.value, response.data)
  } catch (err: any) {
    useMessage().error(err.message)
  }
}

/**
 * 表单提交
 */
const handleDataFormSubmit = async () => {
  await ssoClientDataFormRef.value.validate()
  loading.value = true
  const id = ssoClientDataForm.value.id
  try {
    id ? await editSsoClient(id, ssoClientDataForm.value) : await addSsoClient(ssoClientDataForm.value)
    useMessage().success(`${(id ? t('common.modify') : t('common.save')) + t('common.success')}`)
    $emit('reloadDataList')
  } catch (err: any) {
    useMessage().error(`${id ? t('common.modify') : t('common.save') + t('common.fail')}`)
  } finally {
    visible.value = false
    loading.value = false
  }
}

/**
 * 初始化注册客户端下拉框
 */
const initSelectRegisterClient = async () => {
  try {
    const response: any = await selectRegisterClient()
    registerClientOption.value = response.data
  } catch (err: any) {
    useMessage().error(err.message)
  }
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
      label-width="120px"
    >
      <el-form-item :label="t('ssoClient.fields.registerClientCode')" prop="registerClientCode">
        <el-select
          v-model="ssoClientDataForm.registerClientCode"
          :placeholder="t('common.placeholder.enter') + t('ssoClient.fields.registerClientCode')"
          style="width: 180px"
        >
          <el-option
            v-for="item in registerClientOption"
            :key="item?.value"
            :label="item?.label"
            :value="item?.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('ssoClient.fields.clientCode')" prop="clientCode">
        <el-input
          v-model="ssoClientDataForm.clientCode"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('ssoClient.fields.clientCode')"
        />
      </el-form-item>
      <el-form-item :label="t('ssoClient.fields.clientName')" prop="clientName">
        <el-input
          v-model="ssoClientDataForm.clientName"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('ssoClient.fields.clientName')"
        />
      </el-form-item>
      <el-form-item :label="t('ssoClient.fields.redirect')" prop="redirect">
        <el-input
          v-model="ssoClientDataForm.redirect"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('ssoClient.fields.redirect')"
        />
      </el-form-item>
      <el-form-item :label="t('ssoClient.fields.back')" prop="back">
        <el-input
          v-model="ssoClientDataForm.back"
          autocomplete="off"
          clearable
          :placeholder="t('common.placeholder.enter') + t('ssoClient.fields.back')"
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
