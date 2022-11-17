import { useQuery } from 'react-query'
import qs from 'qs'
import { fetchPanelSetting } from '../services/panel'

export function useFetchPanelSetting(projectId: string, key: string) {
    const info = useQuery(`fetchPanelSetting:${projectId}:${key}`, () => fetchPanelSetting(projectId, key), {
        staleTime: Infinity,
    })
    return info
}
