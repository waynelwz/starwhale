import * as React from 'react'
import { Provider as StyletronProvider } from 'styletron-react'
import { Client as Styletron } from 'styletron-engine-atomic'
import { BaseProvider, LocaleProvider } from 'baseui'
import deep from '@starwhale/ui/theme'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import '@/i18n'
import { render, RenderOptions } from '@testing-library/react'
import { ConfirmCtxProvider } from '@starwhale/ui'
import { AuthProvider } from '@/api/Auth'

const engine = new Styletron()
const queryClient = new QueryClient()
const overrideLanguage = {}

export const WithAll = ({ children }: { children?: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <StyletronProvider value={engine}>
                <BaseProvider theme={deep}>
                    <LocaleProvider locale={overrideLanguage}>
                        <AuthProvider>
                            <ConfirmCtxProvider>
                                <BrowserRouter>{children}</BrowserRouter>
                            </ConfirmCtxProvider>
                        </AuthProvider>
                    </LocaleProvider>
                </BaseProvider>
            </StyletronProvider>
        </QueryClientProvider>
    )
}

export function TestBaseProvider({ children }: { children?: React.ReactNode }) {
    return <BaseProvider theme={deep}>{children}</BaseProvider>
}

export const routeRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: WithAll, ...options })
