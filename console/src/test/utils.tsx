/* eslint-disable import/export */
import { routeRender } from './provider'

// function customRender(ui: React.ReactElement, options = {}) {
//     return render(ui, {
//         // wrap provider(s) here if needed
//         wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
//         ...options,
//     })
// }

export * from '@testing-library/react'

export { default as userEvent } from '@testing-library/user-event'

export { screen } from '@testing-library/react'

export { routeRender as render }

export function wait(n: number) {
    return new Promise((r) => setTimeout(r, n))
}
export function getText<T extends HTMLElement>(el: T) {
    return el.innerText.trim()
}
