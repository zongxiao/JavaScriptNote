"use strict";
{
  let user = {};

  Object.defineProperty(user, 'sex', {
    value: 'male',
    writable: true,
    enumerable: true
  })

  console.log(user);
  user.sex = 'female';
  console.log(user.sex);
}

{
  function toTomorrow() {
    let now = new Date();
    let aim = new Date();
    aim.setDate(now.getDate() + 1);
    aim.setHours(10);
    aim.setMinutes(0);
    aim.setSeconds(0);
    let timerSeconds = (aim.getTime() - now.getTime()) / 1000;
    let hour = Math.floor( timerSeconds / 3600 );
    let seconds = timerSeconds % 3600;
    let minutes = Math.floor( (seconds / 60) );
    console.log(`距离自考查询倒计时${hour}小时${minutes}分`);
  }
  toTomorrow();
}

{
  let obj = {}
  Object.defineProperties(obj, {
    'sex': {
      value: 'male',
      enumerable: true,
      configurable: false,
      writable: false
    },
    'height': {
      value: '175cm',
      writable: true,
      configurable: true,
      enumerable: true
    }
  })

  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      console.log(Object.getOwnPropertyDescriptor(obj, key))
    }
  }

  // 克隆所有obj的属性和标志
  let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
  for (const key in clone) {
    if (Object.hasOwnProperty.call(clone, key)) {
      console.log(Object.getOwnPropertyDescriptor(clone, key))
    }
  }

  let user = {
    name: "John",
    surname: "Smith",
    get fullName() {
      return `${this.name} ${this.surname}`;
    },
    set fullName(value) {
      [this.name, this.surname] = value.split(' ');
    }
  }
  console.log(user.fullName);

  user.fullName = "Luo zongxiao";

  console.log(user.fullName);
  

  let person = {
    get name() {
      return this._name;
    },
    set name(value) {
      if (value.length < 4) {
        console.log('---');
        return ;
      }
      this._name = value;
    }
  }
  console.log(person.name);
  person.name = "121212";
  console.log(person.name);
}