import { describe, expect, vi } from 'vitest'
import renderer from 'react-test-renderer'
import JobForm from '../components/JobForm'

const onSubmit = vi.fn()

describe('JobForm component', () => {
    it('should form be renders corrent default', () => {
        const tree = renderer.create(<JobForm onSubmit={onSubmit} />).toJSON()
        expect(tree).toMatchSnapshot()
    })
    it('should form auto filled when have query args', () => {})
    it('should model handeler auto select when modelVersion selected', () => {})
    it('should model handeler auto select', () => {})
})
