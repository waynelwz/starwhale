import React from 'react'
import { useQueryDatasetList } from '@/domain/datastore/hooks/useFetchDatastore'
import { useHistory, useParams } from 'react-router-dom'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import { useAuth } from '@/api/Auth'
import { getMetaRow } from '@/domain/dataset/utils'
import { Pagination } from 'baseui/pagination'
import { IPaginationProps } from '@/components/Table/IPaginationProps'
import { usePage } from '@/hooks/usePage'
import DatasetViewer from '@/components/Viewer/DatasetViewer'
import { Tabs, Tab } from 'baseui/tabs'
import { getReadableStorageQuantityStr } from '@/utils'
import IconFont from '@/components/IconFont/index'
import { createUseStyles } from 'react-jss'
import qs from 'qs'
import { DatasetObject, TYPES } from '@/domain/dataset/sdk'
import { useSearchParam } from 'react-use'
import { useDatasetVersion } from '@/domain/dataset/hooks/useDatasetVersion'

const useCardStyles = createUseStyles({
    wrapper: {
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    },
    icon: {
        position: 'absolute',
        top: '-60px',
        right: 0,
    },
    tableCell: {
        'position': 'relative',
        'textAlign': 'left',
        '&:hover $cardFullscreen': {
            display: 'grid',
        },
    },
})

export default function ModelVersionFiles() {
    const { projectId, modelId, modelVersionId } = useParams<{
        projectId: string
        modelId: string
        modelVersionId: string
    }>()
    // @FIXME layoutParam missing when build
    const layoutParam = useSearchParam('layout') as string
    const [page, setPage] = usePage()
    const { token } = useAuth()
    const history = useHistory()
    const styles = useCardStyles()
    const { datasetVersion } = useDatasetVersion()

    return <div className={styles.wrapper}></div>
}
