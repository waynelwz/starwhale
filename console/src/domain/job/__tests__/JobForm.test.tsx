import { describe, expect, it, test, vi } from 'vitest'
import { render, screen, fireEvent, wait } from '@/test/utils'
import JobForm from '../components/JobForm'

const onSubmit = vi.fn()

describe('JobForm component', async () => {
    test('should form be renders corrent default', async () => {
        const tree = render(<JobForm onSubmit={onSubmit} />)
        const { container } = tree
        await wait(100)
        // expect(tree).toMatchSnapshot()
        // expect(tree.getAllByLabelText('Resource Pool')).toHaveLength(1)
        const input = container.querySelector('input')
        // if (input) fireEvent.change(input, { target: { value: 'test' } })
        expect(input.value).toEqual('bj005')
    })
    it('should form auto filled when have query args', () => {})
    it('should model handeler auto select when modelVersion selected', () => {})
    it('should model handeler auto select', () => {})
})
