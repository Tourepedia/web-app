// @flow
const _isObjectOfType = (obj: mixed, type: string): boolean => {
  var clas = Object.prototype.toString.call(obj).slice(8, -1);
  return obj !== undefined && obj !== null && clas === type;
}

export const isArray = (obj: mixed): boolean => _isObjectOfType(obj, "Array")
export const isObject = (obj: mixed): boolean => _isObjectOfType(obj, "Object")
export const isString = (obj: mixed): boolean => _isObjectOfType(obj, "String")
