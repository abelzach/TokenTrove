'use server'

import { nanoid } from 'nanoid'

export async function createPayout(formData: FormData) {
  const amount = formData.get('amount') as string
  const tokenAddress = formData.get('tokenAddress') as string
  const password = formData.get('password') as string
  
  const hash = nanoid(10)

  const payoutLink = `/payout/${hash}`

  return { success: true, payoutLink }
}

