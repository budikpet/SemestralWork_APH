
/**
 * - The BaseObject is the base class for all objects in the DragonBones framework.
 * All BaseObject instances are cached to the object pool to reduce the performance consumption of frequent requests for memory or memory recovery.
 * @version DragonBones 4.5
 * @language en_US
 */
/**
 * - 基础对象，通常 DragonBones 的对象都继承自该类。
 * 所有基础对象的实例都会缓存到对象池，以减少频繁申请内存或内存回收的性能消耗。
 * @version DragonBones 4.5
 * @language zh_CN
 */
export abstract class BaseObject {

  private static _returnObject(object: BaseObject): void {
    const classType = String(object.constructor);
    const maxCount = classType in BaseObject._maxCountMap ? BaseObject._maxCountMap[classType] : BaseObject._defaultMaxCount;
    const pool = BaseObject._poolsMap[classType] = BaseObject._poolsMap[classType] || [];
    if (pool.length < maxCount) {
      if (!object._isInPool) {
        object._isInPool = true;
        pool.push(object);
      } else {
        console.warn('The object is already in the pool.');
      }
    } else {
    }
  }

  public static toString(): string {
    throw new Error();
  }
  /**
   * - Set the maximum cache count of the specify object pool.
   * @param objectConstructor - The specify class. (Set all object pools max cache count if not set)
   * @param maxCount - Max count.
   * @version DragonBones 4.5
   * @language en_US
   */
  /**
   * - 设置特定对象池的最大缓存数量。
   * @param objectConstructor - 特定的类。 (不设置则设置所有对象池的最大缓存数量)
   * @param maxCount - 最大缓存数量。
   * @version DragonBones 4.5
   * @language zh_CN
   */
  public static setMaxCount(objectConstructor: (typeof BaseObject) | null, maxCount: number): void {
    if (maxCount < 0 || maxCount !== maxCount) { // isNaN
      maxCount = 0;
    }

    if (objectConstructor !== null) {
      const classType = String(objectConstructor);
      const pool = classType in BaseObject._poolsMap ? BaseObject._poolsMap[classType] : null;
      if (pool !== null && pool.length > maxCount) {
        pool.length = maxCount;
      }

      BaseObject._maxCountMap[classType] = maxCount;
    } else {
      BaseObject._defaultMaxCount = maxCount;

      for (let classType of Object.keys(BaseObject._poolsMap)) {
        const pool = BaseObject._poolsMap[classType];
        if (pool.length > maxCount) {
          pool.length = maxCount;
        }

        if (classType in BaseObject._maxCountMap) {
          BaseObject._maxCountMap[classType] = maxCount;
        }
      }
    }
  }
  /**
   * - Clear the cached instances of a specify object pool.
   * @param objectConstructor - Specify class. (Clear all cached instances if not set)
   * @version DragonBones 4.5
   * @language en_US
   */
  /**
   * - 清除特定对象池的缓存实例。
   * @param objectConstructor - 特定的类。 (不设置则清除所有缓存的实例)
   * @version DragonBones 4.5
   * @language zh_CN
   */
  public static clearPool(objectConstructor: (typeof BaseObject) | null = null): void {
    if (objectConstructor !== null) {
      const classType = String(objectConstructor);
      const pool = classType in BaseObject._poolsMap ? BaseObject._poolsMap[classType] : null;
      if (pool !== null && pool.length > 0) {
        pool.length = 0;
      }
    } else {
      for (let k of Object.keys(BaseObject._poolsMap)) {
        const pool = BaseObject._poolsMap[k];
        pool.length = 0;
      }
    }
  }
  /**
   * - Get an instance of the specify class from object pool.
   * @param objectConstructor - The specify class.
   * @version DragonBones 4.5
   * @language en_US
   */
  /**
   * - 从对象池中获取特定类的实例。
   * @param objectConstructor - 特定的类。
   * @version DragonBones 4.5
   * @language zh_CN
   */
  public static borrowObject<T extends BaseObject>(objectConstructor: { new(): T; }): T {
    const classType = String(objectConstructor);
    const pool = classType in BaseObject._poolsMap ? BaseObject._poolsMap[classType] : null;
    if (pool !== null && pool.length > 0) {
      const object = pool.pop() as T;
      object._isInPool = false;
      return object;
    }

    const object = new objectConstructor();
    object._onClear();
    return object;
  }
  /**
   * - A unique identification number assigned to the object.
   * @version DragonBones 4.5
   * @language en_US
   */
  /**
   * - 分配给此实例的唯一标识号。
   * @version DragonBones 4.5
   * @language zh_CN
   */
  public readonly hashCode: number = BaseObject._hashCode++;
  private static _hashCode: number = 0;
  private static _defaultMaxCount: number = 3000;
  private static readonly _maxCountMap: SMap<number> = {};
  private static readonly _poolsMap: SMap<Array<BaseObject>> = {};
  private _isInPool: boolean = false;
  /**
   * - Clear the object and return it back to object pool。
   * @version DragonBones 4.5
   * @language en_US
   */
  /**
   * - 清除该实例的所有数据并将其返还对象池。
   * @version DragonBones 4.5
   * @language zh_CN
   */
  public returnToPool(): void {
    this._onClear();
    BaseObject._returnObject(this);
  }

  protected abstract _onClear(): void;
}