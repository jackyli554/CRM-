const pj = require('../package.json')
const { resolve } = require('path')
module.exports = {
  name: `${pj.name}`,
  namespace: `https://github.com/${pj.author}/monkey-${pj.name}`,
  match: [
        'https://*.cybozu.cn/k/*',
        'https://*.cybozu.com/k/*',
        'https://*.cybozu-dev.com/k/*',
        'https://*.kintone.com/k/*',
  ],
  grant: ['GM_getValue', 'GM_setValue', 'GM_addValueChangeListener'],
  require: [`file://${resolve(__dirname, '../dist/dev').replaceAll('\\', '/')}/${pj.name}.script.js`],
}
