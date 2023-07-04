import { describe, expect, it, test, vi } from 'vitest'
import { render, screen, fireEvent, wait } from '@/test/utils'
import JobForm from '../components/JobForm'

const onSubmit = vi.fn()

describe('JobForm component', async () => {
    test('should form be renders corrent default', async () => {
        const tree = render(<JobForm onSubmit={onSubmit} />)
        const { container, component } = tree
        await wait(100)

        expect(container.querySelector('input')).toMatchSnapshot()
        // expect(screen.getByRole('combobox')).
        // const input = container.querySelector('input')
        // if (input) fireEvent.change(input, { target: { value: 'test' } })
        // expect(input.value).toEqual('bj005')
        console.log(screen)
    })
    it('should form auto filled when have query args', () => {})
    it('should model handeler auto select when modelVersion selected', () => {})
    it('should model handeler auto select', () => {})
})
