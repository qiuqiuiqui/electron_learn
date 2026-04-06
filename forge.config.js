module.exports = {
  packagerConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'win32', 'linux']
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'qiuqiuiqui',
          name: 'electron_learn'
        },
        prerelease: false,
        draft: true
      }
    }
  ]
};
