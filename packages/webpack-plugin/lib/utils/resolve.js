const parseRequest = require('./parse-request')
const { RESOLVE_IGNORED_ERR } = require('./const')

/**
 * 解析资源路径
 * @param {string} context - 上下文路径
 * @param {string} request - 请求路径
 * @param {object} loaderContext - loader上下文
 * @param {function} callback - 回调函数
 * @param {boolean} trackDependency - 是否记录依赖关系，默认为true
 */
module.exports = function resolve (context, request, loaderContext, callback, trackDependency = true) {
  const { queryObj } = parseRequest(request)
  context = queryObj.context || context
  // 使用compiler的resolver直接解析，不添加到webpack的dependency追踪中
  const resolver = (trackDependency ? null : loaderContext._compiler?.resolverFactory?.get('normal')) || loaderContext
  return resolver.resolve(context, request, (err, resource, info) => {
    if (err) return callback(err)
    if (resource === false) return callback(RESOLVE_IGNORED_ERR)
    callback(null, resource, info)
  })
}
