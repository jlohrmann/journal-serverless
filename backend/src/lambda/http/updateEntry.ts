import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateEntryRequest } from '../../requests/UpdateEntryRequest'
import { updateEntry } from '../../businessLogic/entries'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing entry: ', event)

  const entryId = event.pathParameters.entryId
  const changeEntry: UpdateEntryRequest = JSON.parse(event.body)

  // Update an Entry item with the provided id using values in the "updatedEntry" object
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const item = await updateEntry(changeEntry, entryId, jwtToken)

  // Implement updating an item
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      "Access-Control-Allow-Headers" : "Content-Type"
    },
    body: JSON.stringify({
       item
    })
  }
}
