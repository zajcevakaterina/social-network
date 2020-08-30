import React from 'react';
import { configure, shallow } from 'enzyme'; // для конфигурации адаптера
import Adapter from 'enzyme-adapter-react-16';
import MessageHandler from '../MessageHandler/MessageHandler';

configure({
  adapter: new Adapter()
})

describe('MessageHandler test', () => {

  it('should have a textarea field for typing message', () => {
    const props = {
      onAddMessage: jest.fn(),
      messageToEdit: '',
      onEditMessage: jest.fn()
    };
  
    const wrapper = shallow(<MessageHandler {...props} /> ); // поверхностно рендерит элемент
  
    expect(wrapper.find('textarea[type="text"]').length).toEqual(1);
  })
})