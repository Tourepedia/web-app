const _isObjectOfType = (obj, type) => {
  var clas = Object.prototype.toString.call(obj).slice(8, -1);
  return obj !== undefined && obj !== null && clas === type;
}

export const isArray = (obj) => _isObjectOfType(obj, "Array")
export const isObject = (obj) => _isObjectOfType(obj, "Object")
export const isString = (obj) => _isObjectOfType(obj, "String")
