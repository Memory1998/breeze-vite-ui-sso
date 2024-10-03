export default {
  ssoClient: {
    fields: {
      clientCode: '客户端编码',
      clientUrl: '客户端URL',
    },
    rules: {
      clientCodeExists: '输入的客户端编码重复',
    },
  },
}
