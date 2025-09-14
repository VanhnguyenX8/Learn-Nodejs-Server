import _ from 'lodash';
import { Model } from 'sequelize';

/// This converts camelCase to snake_case for API responses
export class BaseModel<T extends {} = any, T2 extends {} = any> extends Model<T, T2> {
  toJSON() {
    const attributes = { ...this.get() as Record<string, any> };
    return _.mapKeys(attributes, (_value, key) => _.snakeCase(key));
  }

  static fromJson<T = any>(data: object): T {
    return _.mapKeys(data as Record<string, any>, (_value, key) => _.camelCase(key)) as T;
  }
}