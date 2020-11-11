import * as _ from 'lodash';
import { IRuleFunc, IRuleObj } from '../core/MobxForm';

export function generateFormData(fullData: object, keys: string[]): object {
  const data = {};
  keys.forEach(key => _.set(data, key, _.get(fullData, key)));
  return data;
}

export function getValueFromEvent(e: any): boolean | string {
  // support custom element
  if (!e || !e.target) {
    return e;
  }
  const { target } = e;
  return target.type === 'checkbox' ? target.checked : target.value;
}

export function checkIsRequired(
  rules: Array<IRuleFunc | IRuleObj> | IRuleFunc | IRuleObj
): boolean {
  if (rules) {
    if (_.isArray(rules)) {
      // @ts-ignore
      return (
        // @ts-ignore
        rules.filter((item: IRuleFunc | IRuleObj) => {
          if (!_.isFunction(item)) {
            // @ts-ignore
            return item.required;
          }
          return false;
        }).length > 0
      );
    }
    if (!_.isFunction(rules)) {
      // @ts-ignore
      return Boolean(rules.required);
    }
  }
  return false;
}
