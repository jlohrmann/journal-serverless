/**
 * Fields in a request to update a single Enry item.
 */
export interface UpdateEntryRequest {
  entry: string
  reviewByDate: string
  readyToPublish: boolean
}