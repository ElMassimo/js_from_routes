const path = require('path')

function resolveJavascript (dir) {
  return path.join(__dirname, '../../app/javascript', dir)
}

module.exports = {
  resolve: {
    alias: {
      '@helpers': resolveJavascript('helpers'),
      '@requests': resolveJavascript('requests'),
      '@services': resolveJavascript('services'),
    }
  }
}
