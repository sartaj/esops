const os = require('os')

export default () => {
  return {
    newTemporaryResolvedFolder: async () => {},
    getResolvedFolder: async () => {},
    createResolvedFolder: async () => {},

    getTemporaryRenderFolder: async () => {},
    createTemporaryRenderFolder: async () => {},

    getTemporaryDirectory: async () => os.tmpdir(),
    deleteTemporaryDirectory: async () => {}
  }
}
