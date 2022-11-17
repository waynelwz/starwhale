import { IListQuerySchema, IListSchema } from '@/domain/base/schemas/list'
import axios from 'axios'
import {
    IAgentSchema,
    IDeviceSchema,
    ISystemResourcePool,
    ISystemSettingSchema,
    ISystemVersionSchema,
} from '../schemas/panel'

export async function fetchPanelSetting(projectId: string, key: string): Promise<ISystemSettingSchema> {
    const resp = await axios.get(`/api/v1/panel/setting/${projectId}/${key}`)
    return resp.data
}

export async function updatePanelSetting(projectId: string, key: string, data: Object): Promise<any> {
    const resp = await axios.post(`/api/v1/panel/setting/${projectId}/${key}`, data)
    return resp.data
}
