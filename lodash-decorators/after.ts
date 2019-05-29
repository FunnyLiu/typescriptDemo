import * as _ from 'loadsh'

import { After } from 'lodash-decorators'

class Person {
    @After(3)
    consoleInfo(v:string){
        console.log(`done: ${v}`)
    }

    task(){
        _.forEach(['hehe','xixi','haha','lala'],(v:string)=>{
            this.consoleInfo(v)
        })
    }
}

const person = new Person()
person.task()