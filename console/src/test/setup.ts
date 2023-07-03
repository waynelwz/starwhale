import { server } from './mockServer'
import { vi } from 'vitest'

beforeAll(() => {
    vi.spyOn(global.console, 'warn').mockImplementation(() => {})

    server.listen({ onUnhandledRequest: 'error' })
})
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
