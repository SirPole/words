'use strict'

import React from 'react'
import renderer from 'react-test-renderer'
import LocalStorageMock from '../__mocks__/localStorage.mock'
import Auth from '../src/components/Auth'
global.localStorage = new LocalStorageMock()

describe('Auth', () => {
  it('Should render', () => {
    const component = renderer.create(
      <Auth />
    )
    let tree        = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
