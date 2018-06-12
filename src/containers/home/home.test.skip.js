import setupIntegrationTest, {
  flushPromises
} from '../../bootstrap/setup-integration-test'

import Home from '.'

let integration = {
  store: null,
  history: null,
  dispatchSpy: null,
  mountApp: null
}

beforeEach(() => {
  integration = setupIntegrationTest({ router: { location: '/' } })
})

it.skip('Renders and loads balance correctly.', async () => {
  const app = integration.mountApp()
  await flushPromises(app)
  expect(
    app
      .find(Home)
      .find('.Home-message')
      .at(1)
      .text()
  ).toBe('Welcome [Blockies], You have 100 ETH.')
})
