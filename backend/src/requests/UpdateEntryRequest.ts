/**
 * Fields in a request to update a single Enry item.
 */
export interface UpdateEntryRequest {
  entryText: string
  reviewByDate: string
  readyToPublish: boolean
}