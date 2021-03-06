export interface EntryItem {
  userId: string
  entryId: string
  createdAt: string
  entryText: string
  reviewByDate: string
  readyToPublish: boolean
  attachmentUrl?: string
  timestamp: string
}
