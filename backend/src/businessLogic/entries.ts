import * as uuid from 'uuid'

import { EntryItem } from '../models/EntryItem'
import { EntryAccess } from '../datalayer/entryAccess'
import { CreateEntryRequest } from '../requests/CreateEntryRequest'
import { UpdateEntryRequest } from '../requests/UpdateEntryRequest'
import { parseUserId } from '../auth/utils'

const entryAccess = new EntryAccess()

export async function getAllEntries(userId: string): Promise<EntryItem[]> {
  return entryAccess.getAllEntries(userId)
}

export async function createEntry(
  createEntryRequest: CreateEntryRequest, 
  jwtToken: string
): Promise<EntryItem> {

  const entryId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await entryAccess.createEntry({
    entryId: entryId,
    userId: userId,
    createdAt: new Date().toISOString(),
    name: createEntryRequest.name,
    dueDate: createEntryRequest.dueDate,
    done: false,
    attachmentUrl: '',
    timestamp: new Date().toISOString()
  })
}

export async function updateEntry(
  updateEntryRequest: UpdateEntryRequest,
  updateEntryId: string,
  jwtToken: string
): Promise<EntryItem> {
  
  const userId = parseUserId(jwtToken)

  return await entryAccess.updateEntry({
    userId: userId,
    entryId: updateEntryId,
    createdAt: new Date().toISOString(),
    name: updateEntryRequest.name,
    dueDate: updateEntryRequest.dueDate,
    done: true,
    attachmentUrl: '',
    timestamp: new Date().toISOString()
  })
}

export async function deleteEntry(
  deleteEntryId: string,
  jwtToken: string
): Promise<String> {
  
  const userId = parseUserId(jwtToken)

  return await entryAccess.deleteEntry(userId, deleteEntryId)
}

