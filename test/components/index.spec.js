import React from 'react';
import { mount, shallow, render } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

google = sinon.stub();
import Index from '../../client/index';
import {Provider} from 'react-redux';

describe('<Index />', () => {
  it('should exist', function() {
    const wrapper = shallow(<Index />);
    expect(wrapper).to.exist;
  })
  it('should render App', () => {
    const wrapper = shallow(<Index />);
    expect(wrapper.find(App)).to.exist;
  })
  it('should have a Provider', () => {
    const wrapper = shallow(<Index />);
    expect(wrapper.find(Provider)).to.exist;
  })
  it('should render on the DOM', () => {
    const wrapper = shallow(<Index />);
    expect(document.getElementById('app').hasChildNodes()).to.be.true;
  })
})
