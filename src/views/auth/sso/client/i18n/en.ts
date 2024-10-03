export default {
  client: {
    fields: {
      basicSettings: 'basic settings',
      clientId: 'client id',
      clientName: 'client name',
      clientSecret: 'client secret',
      confirmClientSecret: 'confirm client secret',
      clientIdIssuedAt: 'clientIdIssuedAt',
      redirectUris: 'redirectUris',
      clientSecretExpiresAt: 'clientSecretExpiresAt',
    },
    rules: {
      clientCodeExists: 'The input client code already exists',
    },
  },
}
