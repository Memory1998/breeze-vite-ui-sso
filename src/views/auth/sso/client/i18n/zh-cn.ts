export default {
  client: {
    fields: {
      basicSettings: '基础配置',
      clientId: '客户端标识',
      clientName: '客户端名',
      clientSecret: '客户密钥',
      confirmClientSecret: '确认密钥',
      clientIdIssuedAt: '发布日期',
      redirectUris: '重定向URI',
      clientSecretExpiresAt: '密钥到期时间',
    },
    rules: {
      clientCodeExists: '客户端编码已存在',
    },
  },
}
