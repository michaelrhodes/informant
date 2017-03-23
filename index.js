module.exports = informant

var types = {
  node: node,
  nodelist: nodelist,
  string: string,
  object: object
}

function informant () {
  var root = this.document || this
  var result = {}, args = arguments
  var i = 0, l = args.length, fn
  for (; i < l; i++)
    if (fn = types[type(args[i])])
      fn(root, args[i], result)
  return result
}

function nodelist (root, nl, out) {
  var n, name, value
  var i = 0, l = nl.length
  while (i < l && (n = nl[i++]))
    node(root, n, out)
  return out
}

function node (root, n, out) {
  if (!n.id) return out
  var name = n.id, value = val(n)
  out[name] = typeof value == 'string' ?
    value !== '' && { value: value } :
    value
  return out
}

function string (root, str, out) {
  var nl = root.querySelectorAll(str)
  return !nl ? out : nl.length > 1 ?
    nodelist(root, nl, out) :
    node(root, nl[0], out)
}

function object (root, obj, out) {
  obj.el = obj.el || '',
  obj.match = obj.match || '',
  obj.max = obj.max || '',
  obj.min = obj.min || ''

  var field = obj.el && typeof obj.el == 'string' ?
    root.querySelector(obj.el) : obj.el

  if (!field) return

  var name = field.id
  var value = val(field)
  out[name] = value !== '' && {}
  if (!value) return

  if (typeof value == 'boolean') {
    out[name] = value
    return
  }

  // Run checks
  var chars = value.length
  var mtype = type(obj.match)
  if (obj.min) out[name].min = chars >= obj.min
  if (obj.max) out[name].max = chars <= obj.max
  if (obj.match) out[name].match = !!(
    mtype === 'regexp' ? value.match(obj.match) :
    mtype === 'function' ? obj.match(value) :
    value === obj.match
  )

  out[name].value = value
  return out
}

function val (el) {
  return (
    el.type === 'checkbox' ? el.checked :
    el.type === 'radio' ? el.checked && trim(el.value) :
    trim(el.value)
  )
}

function type (input) {
  var type = ({}.toString)
    .call(input)
    .slice(8, -1)
    .toLowerCase()

  var node = /node|element/.test(type)
  return node ? 'node' : type
}

function trim (str) {
  return str.replace(/^\s+|\s+$/g, '')
}
