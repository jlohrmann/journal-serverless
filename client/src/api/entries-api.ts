import { apiEndpoint } from '../config'
import { Entry } from '../types/Entry';
import { CreateEntryRequest } from '../types/CreateEntryRequest';
import Axios from 'axios'
import { UpdateEntryRequest } from '../types/UpdateEntryRequest';

export async function getEntries(idToken: string): Promise<Entry[]> {
  console.log('Fetching entries')

  const response = await Axios.get(`${apiEndpoint}/entries`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Entries:', response.data)
  return response.data.items
}

export async function createEntry(
  idToken: string,
  newEntry: CreateEntryRequest
): Promise<Entry> {
  const response = await Axios.post(`${apiEndpoint}/entries`,  JSON.stringify(newEntry), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchEntry(
  idToken: string,
  entryId: string,
  updatedEntry: UpdateEntryRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/entries/${entryId}`, JSON.stringify(updatedEntry), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteEntry(
  idToken: string,
  entryId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/entries/${entryId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  entryId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/entries/${entryId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
