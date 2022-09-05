import { ILoginUserSchema } from '@/domain/user/schemas/user'
import { fetchCurrentUser, loginUser } from '@/domain/user/services/user'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import qs from 'qs'
import { simulationJump } from '@/utils'
import { getToken, setToken } from '@/api'

type IAuthContext = {
    token: string | null
    onLogin: (data: ILoginUserSchema) => Promise<string>
    onLogout: () => void
    triggerTokenRefresh: () => Promise<void>
}
export const AuthContext = React.createContext<IAuthContext>({
    token: null,
    onLogin: () => Promise.resolve(''),
    onLogout: () => {},
    triggerTokenRefresh: () => Promise.resolve(),
})

export const useAuth = () => {
    return React.useContext(AuthContext)
}

// eslint-disable-next-line
const location = window.location

export const AuthProvider = ({ children }: any) => {
    const [currentToken, setCurrentToken] = React.useState(getToken())

    const userInfo = useQuery('currentUser', fetchCurrentUser, { refetchOnWindowFocus: false, retry: 0 })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const { setCurrentUser } = useCurrentUser()

    useEffect(() => {
        if (userInfo.isSuccess) {
            setCurrentUser(userInfo.data)
            if (userInfo.data) {
                setCurrentToken(getToken())
            }
        }
    }, [userInfo, setCurrentUser])

    const handleLogin = async (data: ILoginUserSchema) => {
        try {
            await loginUser(data)
            await userInfo.refetch()
        } catch (error) {
            return ''
        } finally {
            if (getToken() !== currentToken) setCurrentToken(getToken())
        }

        const search = qs.parse(location.search, { ignoreQueryPrefix: true })
        let { redirect } = search
        if (redirect && typeof redirect === 'string') {
            redirect = decodeURI(redirect)
        } else {
            redirect = '/'
        }

        return redirect
    }

    const handleLogout = () => {
        setToken(undefined)
        simulationJump('/logout')
    }

    const value = {
        token: currentToken,
        onLogin: handleLogin,
        onLogout: handleLogout,
        triggerTokenRefresh: async () => {
            setCurrentToken(getToken())
            await userInfo.refetch()
        },
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
