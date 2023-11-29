import React, { useEffect } from 'react'
import { api } from '@/api'
import { Button, GridResizer } from '@starwhale/ui'
import useFineTuneOnlineEval from '@/domain/space/hooks/useOnlineEval'
import FineTuneOnlineEvalJobCard from './FineTuneOnlineEvalJobCard'
import useTranslation from '@/hooks/useTranslation'
import { useHistory } from 'react-router-dom'
import FineTuneOnlineEvalServings from './FineTuneOnlineEvalServings'
import { useServingConfig } from '@starwhale/ui/Serving/store/config'

const GRID_LAYOUT = [
    // RIGHT:
    '0px 40px 1fr',
    // MIDDLE:
    '350px 40px 1fr',
]

export default function FineTuneOnlineEvalListCard() {
    const [t] = useTranslation()
    const config = useFineTuneOnlineEval()
    const history = useHistory()
    const { projectId, spaceId } = config
    const info = api.useListOnlineEval(projectId, spaceId)
    const sc = useServingConfig()

    useEffect(() => {
        sc.setJobs(info.data ?? [])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [info.data])

    return (
        <div className='content-full pt-12px'>
            <GridResizer
                left={() => (
                    <div className='flex flex-col w-full gap-10px'>
                        <Button
                            isFull
                            size='compact'
                            onClick={() => {
                                history.push(`/projects/${projectId}/new_fine_tune_online/${spaceId}`)
                            }}
                        >
                            {t('create')}
                        </Button>
                        <div className='content-full'>
                            <FineTuneOnlineEvalJobCard />{' '}
                        </div>
                    </div>
                )}
                gridLayout={GRID_LAYOUT}
                right={() => <FineTuneOnlineEvalServings />}
                draggable={false}
                resizebar='expand'
            />
        </div>
    )
}

// {
//     /* <RouteOverview
//     key={key}
//     url={routes.onlineServings}
//     onClose={gotoList}
//     extraActions={null}
//     hasFullscreen={false}
//     title={title}
// /> */
// }
