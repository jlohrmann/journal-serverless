/**
 * Fields in a request to update a single Enry item.
 */
export interface UpdateEntryRequest {
  name: string
  dueDate: string
  done: boolean
}