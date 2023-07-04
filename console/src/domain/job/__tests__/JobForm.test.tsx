import { describe, expect, it, test, vi } from 'vitest'
import { render, screen, fireEvent, wait, waitFor } from '@/test/utils'
import JobForm from '../components/JobForm'

const onSubmit = vi.fn()

function executeAfterTwoHours(func) {
    setTimeout(func, 1000 * 60 * 60 * 2) // 2 hours
}

function executeEveryMinute(func) {
    setInterval(func, 1000 * 60) // 1 minute
}

describe('JobForm component', async () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    test('should form be renders corrent default', async () => {
        const tree = render(<JobForm onSubmit={onSubmit} />)
        const { container } = tree
        // vi.advanceTimersToNextTimer()
        vi.runAllTimers()

        // await waitFor(() => {
        // screen.debug()

        expect(await screen.findByText('bj005')).toBeInTheDocument()

        // expect(container.querySelector('[class^=row3]')).toMatchSnapshot()
        // })
        // expect(screen.getByRole('combobox')).
        const input = container.querySelector('input')
        if (input) fireEvent.change(input, { target: { value: 'test' } })
        // expect(input.value).toEqual('bj005')
    })
    it('should form auto filled when have query args', () => {})
    it('should model handeler auto select when modelVersion selected', () => {})
    it('should model handeler auto select', () => {})
})
