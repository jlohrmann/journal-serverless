export interface EntryItem {
  userId: string
  entryId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
  timestamp: string
}
