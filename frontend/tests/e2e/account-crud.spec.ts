import { expect, test } from '@playwright/test'
import type { Route } from '@playwright/test'

type MockAccount = {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  country: string
}

const baseAppUrl = 'http://localhost:5173'

test.describe('Account CRUD workflow', () => {
  test('creates, updates, and deletes an account', async ({ page, baseURL }) => {
    const accounts: MockAccount[] = [
      {
        id: '1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada.lovelace@example.com',
        phoneNumber: '555-0101',
        country: 'United Kingdom'
      }
    ]

    const fulfillJson = async (route: Route, data: unknown, status = 200) => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(data)
      })
    }

    await page.route('**/api/accounts/*', async (route) => {
      const request = route.request()
      const method = request.method()
      const url = new URL(request.url())
      const accountId = url.pathname.split('/').pop()

      if (!accountId) {
        await route.fallback()
        return
      }

      if (method === 'PUT') {
        const payload = (await request.postDataJSON()) as Partial<MockAccount>
        const index = accounts.findIndex((account) => account.id === accountId)

        if (index === -1) {
          await route.fulfill({ status: 404 })
          return
        }

        accounts[index] = { ...accounts[index], ...payload, id: accountId }
        await fulfillJson(route, accounts[index])
        return
      }

      if (method === 'DELETE') {
        const index = accounts.findIndex((account) => account.id === accountId)

        if (index === -1) {
          await route.fulfill({ status: 404 })
          return
        }

        accounts.splice(index, 1)
        await route.fulfill({ status: 204, body: '' })
        return
      }

      await route.fallback()
    })

    await page.route('**/api/accounts', async (route) => {
      const request = route.request()
      const method = request.method()

      if (method === 'GET') {
        await fulfillJson(route, accounts)
        return
      }

      if (method === 'POST') {
        const payload = (await request.postDataJSON()) as Partial<MockAccount>
        const newAccount: MockAccount = {
          id: String(Date.now()),
          firstName: payload.firstName ?? '',
          lastName: payload.lastName ?? '',
          email: payload.email ?? '',
          phoneNumber: payload.phoneNumber ?? '',
          country: payload.country ?? ''
        }

        accounts.push(newAccount)
        await fulfillJson(route, newAccount, 201)
        return
      }

      await route.fallback()
    })

    await page.goto(baseURL ?? baseAppUrl)

    await expect(page.getByRole('heading', { name: 'Accounts' })).toBeVisible()

    const table = page.getByRole('table')
    await expect(table).toContainText('Ada Lovelace')
    await expect(table).toContainText('ada.lovelace@example.com')

    await page.getByRole('button', { name: 'Add Account' }).click()

    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    await page.getByLabel('First name').fill('Grace')
    await page.getByLabel('Last name').fill('Hopper')
    await page.getByLabel('Email').fill('grace.hopper@example.com')
    await page.getByLabel('Phone').fill('555-0102')
    await page.getByLabel('Country').fill('United States')

    await modal.getByRole('button', { name: 'Save' }).click()

    await expect(modal).toHaveCount(0)

    const createdRow = page.locator('tbody tr').filter({ hasText: 'Grace Hopper' })
    await expect(createdRow).toBeVisible()
    await expect(createdRow).toContainText('grace.hopper@example.com')

    await createdRow.getByRole('button', { name: 'Edit' }).click()

    await expect(modal).toBeVisible()
    await page.getByLabel('Email').fill('g.hopper@example.com')
    await page.getByLabel('Phone').fill('555-0199')

    await modal.getByRole('button', { name: 'Update' }).click()

    await expect(modal).toHaveCount(0)

    const updatedRow = page.locator('tbody tr').filter({ hasText: 'Grace Hopper' })
    await expect(updatedRow).toContainText('g.hopper@example.com')
    await expect(updatedRow).toContainText('555-0199')

    await updatedRow.getByRole('button', { name: 'Delete' }).click()

    await expect(page.locator('tbody tr').filter({ hasText: 'Grace Hopper' })).toHaveCount(0)
    await expect(table).toContainText('Ada Lovelace')
  })
})

