import { expect, test, type Page } from '@playwright/test'
import { mockApi } from './mock-api'

// Errors we expect outside Vercel: analytics/speed-insights scripts only exist on Vercel
const IGNORED = [/\/_vercel\//, /Failed to load resource: the server responded with a status of 404/]

function trackErrors(page: Page) {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
    page.on('console', (m) => {
        if (m.type() === 'error' && !IGNORED.some((re) => re.test(m.text()) || re.test(m.location().url))) errors.push(m.text())
    })
    return errors
}

test.beforeEach(async ({ page }) => {
    await mockApi(page)
})

test('home renders the hero, live sections and no errors', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('shows its work')
    await expect(page.getByText('Where things stand.')).toBeVisible()
    await expect(page.getByText('Twelve large caps, ranked.')).toBeVisible()
    await expect(page.locator('table', { hasText: '30-day signal' })).toContainText('AAPL')
    expect(errors).toEqual([])
})

test('markets shows the heatmap and movers', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto('/markets')
    await expect(page.getByRole('heading', { name: 'Large-cap heatmap' })).toBeVisible()
    await expect(page.getByText('Top gainers')).toBeVisible()
    await expect(page.getByRole('link', { name: /NVDA/ }).first()).toBeVisible()
    expect(errors).toEqual([])
})

test('terminal draws a chart and opens symbol search', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto('/app')
    await expect(page.locator('canvas').first()).toBeVisible()
    await expect(page.getByText('UPTRADE SCORE', { exact: false })).toBeVisible()
    await page.keyboard.press('ControlOrMeta+k')
    const dialog = page.getByRole('dialog', { name: 'Symbol Search' })
    await expect(dialog).toBeVisible()
    await dialog.getByRole('textbox').fill('tesla')
    await expect(dialog.getByText('Tesla, Inc.')).toBeVisible()
    await page.keyboard.press('Enter')
    await expect(page).toHaveTitle(/TSLA/)
    expect(errors).toEqual([])
})

test('dashboard lists the watchlist with scores', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: 'Watchlist', exact: true })).toBeVisible()
    await expect(page.locator('table', { hasText: '30-day' }).locator('tbody tr').first()).toContainText('AAPL')
    await expect(page.getByText('Equal-weight basket')).toBeVisible()
    expect(errors).toEqual([])
})

test('sign-up page renders the form', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
})

test('removed pages redirect to real ones', async ({ page }) => {
    for (const [from, to] of [['/features', '/'], ['/careers', '/about'], ['/tradex', '/app/tradex'], ['/support', '/contact'], ['/legal', '/terms']]) {
        await page.goto(from)
        expect(new URL(page.url()).pathname).toBe(to)
    }
})

test('unknown pages get the styled 404', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist')
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('link', { name: /terminal/i }).first()).toBeVisible()
})
