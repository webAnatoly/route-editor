import {EventEmitter} from 'events';

// Создаём объект Store, добавляем в него свои методы, а так же копируем методы из EventEmitter. 
const Store = Object.assign({}, EventEmitter.prototype, {
  getState(key) {
    return this[key]
  },
  setState(key, value) {
    this[key] = value;
    this.emit('change');
  },
  addChangeListener(callback) {
    this.on('change', callback);
  },
  removeChangeListener(callback) {
    this.removeListener('change', callback);
  },
})

/* 
Объект Store будет использоваться как базовый шаблон для моих конкретных объектов store. 
По-сути я буду просто копировать методы объекта Store в новый объект, который и буду использовать в приложении. 

Пример использования:

const counterStore = Object.assign({}, Store);
const toDoStore = Object.assign({}, Store);
const loginToDoStore = Object.assign({}, Store);

export {counterStore, toDoStore, loginToDoStore};

*/

const mainStore = Object.assign({}, Store);
const counterStore = Object.assign({}, Store);

// инициализация первоначальных состояний для компонентов
mainStore.Container = {
  points: [],
  drag: { on: false, styles: {} },
  html: '',
}

mainStore.InputPoint = {
  inputValue: '',
}

mainStore.OnePointRow = {
  startDrag: false
};

mainStore.Button = { count: 0 };

mainStore.YandexMap = {
  ymaps: window.ymaps, 
  coordsArr: [], // тут буду хранить координаты полученные в результате геокодирования [[55.755814, 37.617635]]
}

export {counterStore, mainStore};