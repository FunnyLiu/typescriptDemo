import {Container, provide, inject} from 'injection';
//The @provide decorator is used to be automatically loaded by the IoC container.
@provide('userModel')
class UserModel {
  public getConsole(){
      console.log('xixi')
  }
}

@provide('userService')
class UserService {
  //The purpose of @inject() is to instantiate the definition in the container into an object and bind it to the property,
  //so that it can be accessed at the time of the call.
  @inject()
  private userModel:UserModel;
  
  async getUser(uid:number) {
    // TODO
    this.userModel.getConsole()
    return `Brizer:${uid}`;
  }
}

//The container, which is encapsulated in the upper layer, can easily generate class definitions through the bind function.
const container = new Container();
container.bind(UserService);
container.bind(UserModel);

async function getData() {
  const userService = await container.getAsync<UserService>('userService'); 
  const data = await userService.getUser(123);
  return data;
}

getData().then(console.log);
// xixi
// Brizer:123