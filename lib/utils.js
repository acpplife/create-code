module.exports = {
  camelize (str) {
    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
  },
  getDownloadPkgName (str) {
    const camel = this.camelize(str)
    if (!camel) return ''
    return `${camel.substring(0, 1).toUpperCase()}${camel.substring(1)}Block`
  }
}