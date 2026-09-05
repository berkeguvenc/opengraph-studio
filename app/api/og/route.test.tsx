import { expect, test, describe } from 'vitest'
import { POST } from './route'

describe('POST /api/og', () => {
  test('returns 500 on invalid JSON body', async () => {
    // A body that is not valid JSON
    const mockRequest = new Request('http://localhost/api/og', {
      method: 'POST',
      body: '{ invalid: json }',
    })

    const response = await POST(mockRequest)

    expect(response.status).toBe(500)

    const text = await response.text()
    expect(text).toBe('Failed to generate image')
  })
})
