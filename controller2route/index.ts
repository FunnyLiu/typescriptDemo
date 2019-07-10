import { isFunction } from "lodash";
import 'reflect-metadata'

const METHOD_METADATA = 'method';
const PATH_METADATA = 'path';

function isConstructor(value) {
  try {
    new new Proxy(value, { construct() { return {}; } });
    return true;
  } catch (err) {
    return false;
  }
}

const Controller = (path: string): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(PATH_METADATA, path, target);
  }
}

const createMappingDecorator = (method: string) => (path: string): MethodDecorator => {
  return (target, key, descriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
  }
}

const Get = createMappingDecorator('GET');
const Post = createMappingDecorator('POST');


function mapRoute(instance: Object) {
  const prototype = Object.getPrototypeOf(instance);

  // 筛选出类的 methodName
  const methodsNames = Object.getOwnPropertyNames(prototype)
    .filter(item => !isConstructor(prototype[item]) && isFunction(prototype[item]));
  return methodsNames.map(methodName => {
    const fn = prototype[methodName];

    // 取出定义的 metadata
    const route = Reflect.getMetadata(PATH_METADATA, fn);
    const method = Reflect.getMetadata(METHOD_METADATA, fn);
    return {
      route,
      method,
      fn,
      methodName
    }
  })
};


@Controller('/test')
class SomeClass {
  @Get('/a')
  someGetMethod() {
    return 'hello world';
  }

  @Post('/b')
  somePostMethod() { }
}




Reflect.getMetadata(PATH_METADATA, SomeClass); // '/test'

console.log(mapRoute(new SomeClass()))
// [{
//   route: '/a',
//   method: 'GET',
//   fn: [Function: someGetMethod],
//   methodName: 'someGetMethod'
// },
//   {
//     route: '/b',
//     method: 'POST',
//     fn: [Function: somePostMethod],
//     methodName: 'somePostMethod'
//   }]