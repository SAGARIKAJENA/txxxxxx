// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

vi.mock('@core/config/environment', () => ({
  env: {
    appName: 'TaxEdge',
    apiBaseUrl: 'http://localhost:3000',
    enableMocks: true,
    isDev: true,
    isProd: false,
  },
}))

import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TaxNoticeAssistance } from '../../src/modules/itr/components/TaxNoticeAssistance/TaxNoticeAssistance'
import { userStorage } from '../../src/core/storage/userStorage'

afterEach(() => {
  cleanup()
})

describe('TaxNoticeAssistance Component', () => {
  beforeEach(() => {
    localStorage.clear()
    window.scrollTo = () => {}
  })

  it('renders Step 1 with form fields, step indicator, and bottom actions', () => {
    render(
      <MemoryRouter>
        <TaxNoticeAssistance />
      </MemoryRouter>
    )

    expect(screen.getByText('Tax Notice Assistance')).toBeDefined()
    expect(screen.getByText('Notice Details')).toBeDefined()
    expect(screen.getByText('STEP 1 OF 2: NOTICE DETAILS')).toBeDefined()
    expect(screen.getByText('Enter Notice Information')).toBeDefined()
    expect(screen.getByText('Back')).toBeDefined()
    expect(screen.getByText('Save Draft & Exit')).toBeDefined()
    expect(screen.getByRole('button', { name: /continue/i })).toBeDefined()
  })

  it('validates required fields and prevents proceeding when empty', () => {
    render(
      <MemoryRouter>
        <TaxNoticeAssistance />
      </MemoryRouter>
    )

    const continueBtn = screen.getByRole('button', { name: /continue/i })
    fireEvent.click(continueBtn)

    // Should stay on Step 1
    expect(screen.getByText('STEP 1 OF 2: NOTICE DETAILS')).toBeDefined()
  })

  it('proceeds to Step 2 when form is filled and displays summary review', () => {
    render(
      <MemoryRouter>
        <TaxNoticeAssistance />
      </MemoryRouter>
    )

    // Fill in required fields
    const panInput = screen.getByLabelText(/Permanent Account Number/i)
    fireEvent.change(panInput, { target: { value: 'CASPJ4743E' } })

    const dateInputs = screen.getAllByLabelText(/Notice Date|Response Due Date/i)
    fireEvent.change(dateInputs[0], { target: { value: '2026-09-22' } })
    fireEvent.change(dateInputs[1], { target: { value: '2026-10-15' } })

    const refInput = screen.getByLabelText(/Notice Reference Number/i)
    fireEvent.change(refInput, { target: { value: 'CPC/2526/A3/284419260' } })

    const explanationInput = screen.getByLabelText(/Your Explanation/i)
    fireEvent.change(explanationInput, { target: { value: 'Received 143(1) intimation discrepancy.' } })

    const continueBtn = screen.getByRole('button', { name: /continue/i })
    fireEvent.click(continueBtn)

    // Should advance to Step 2
    expect(screen.getByText('STEP 2 OF 2: UPLOAD NOTICE')).toBeDefined()
    expect(screen.getByText('Upload your Income Tax notice')).toBeDefined()
    expect(screen.getByText('Entered Notice Information')).toBeDefined()
    expect(screen.getByText('CASPJ4743E')).toBeDefined()
    expect(screen.getByRole('button', { name: /continue/i })).toBeDefined()
  })

  it('allows navigating back to Step 1 via Back button on Step 2', () => {
    render(
      <MemoryRouter>
        <TaxNoticeAssistance />
      </MemoryRouter>
    )

    // Fill fields and advance
    fireEvent.change(screen.getByLabelText(/Permanent Account Number/i), { target: { value: 'CASPJ4743E' } })
    const dateInputs = screen.getAllByLabelText(/Notice Date|Response Due Date/i)
    fireEvent.change(dateInputs[0], { target: { value: '2026-09-22' } })
    fireEvent.change(dateInputs[1], { target: { value: '2026-10-15' } })
    fireEvent.change(screen.getByLabelText(/Notice Reference Number/i), { target: { value: 'CPC/2526/A3/284419260' } })
    fireEvent.change(screen.getByLabelText(/Your Explanation/i), { target: { value: 'Testing explanation.' } })

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByText('STEP 2 OF 2: UPLOAD NOTICE')).toBeDefined()

    // Click Back on Step 2
    fireEvent.click(screen.getByTestId('step-back-btn'))
    expect(screen.getByText('STEP 1 OF 2: NOTICE DETAILS')).toBeDefined()
  })

  it('submits application to userStorage on Step 2 Continue', async () => {
    render(
      <MemoryRouter>
        <TaxNoticeAssistance />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Permanent Account Number/i), { target: { value: 'CASPJ4743E' } })
    const dateInputs = screen.getAllByLabelText(/Notice Date|Response Due Date/i)
    fireEvent.change(dateInputs[0], { target: { value: '2026-09-22' } })
    fireEvent.change(dateInputs[1], { target: { value: '2026-10-15' } })
    fireEvent.change(screen.getByLabelText(/Notice Reference Number/i), { target: { value: 'CPC/2526/A3/284419260' } })
    fireEvent.change(screen.getByLabelText(/Your Explanation/i), { target: { value: 'Testing submission.' } })

    fireEvent.click(screen.getByTestId('step-continue-btn'))

    // Click Continue on Step 2
    fireEvent.click(screen.getByTestId('step-continue-btn'))

    expect(await screen.findByText('Notice Submitted for Review')).toBeDefined()
    const apps = userStorage.getUserApplications()
    expect(apps.length).toBeGreaterThan(0)
    expect(apps[0].code).toMatch(/^NOT-/)
  })
})
