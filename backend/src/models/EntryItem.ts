export interface EntryItem {
  userId: string
  entryId: string
  createdAt: string
  entry: string
  reviewByDate: string
  readyToPublish: boolean
  attachmentUrl?: string
  timestamp: string
}
