export default {
  ssoClient: {
    fields: {
      registerClientCode: '注册客户端编码',
      clientCode: '客户端编码',
      clientName: '客户端名称',
      redirect: '重定向地址',
      back: '重定向后跳转地址',
    },
    rules: {
      clientCodeExists: '输入的客户端编码重复',
    },
  },
}
