import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { EntryItem } from '../models/EntryItem'
import { createLogger } from '../utils/logger'
const logger = createLogger('auth')

export class EntryAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly entriesTable = process.env.ENTRIES_TABLE) {
    }

    async getAllEntries(userid: string): Promise<EntryItem[]> {

        try {
            const result = await this.docClient.query({
                TableName: this.entriesTable,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userid
                }                
            }).promise()
            const items = result.Items
            logger.info('Retrieving all entries', {
                resultItems: items
              })
            
            return items as EntryItem[]
        }
        catch ( err ){

            console.log(' Error getting all entries: ' + err )
            
        }

    }

    async createEntry(entry: EntryItem): Promise<EntryItem> {

        await this.docClient.put({
            TableName: this.entriesTable,
            Item: entry
        }).promise()

        logger.info('Creating new entry', {
            newEntry: entry
          })
        return entry

    }

    async updateEntry(entry: EntryItem): Promise<EntryItem> {
        
        await this.docClient.update({
            TableName: this.entriesTable,
            Key: { 
                    userId: entry.userId, 
                    entryId: entry.entryId 
            },
            UpdateExpression: "set #name = :a, done = :b, dueDate = :c",
            ExpressionAttributeNames: {'#name' : 'name'},
            ExpressionAttributeValues: {
                ":a": entry.name,
                ":b": entry.done,
                ":c": entry.dueDate
            },
            ReturnValues: 'ALL_NEW'             

        }).promise()

        logger.info('Updating an entry', {
            updatedItem: entry
          })

        return entry
    }



    async deleteEntry(userId: string, entryId: string) {
        
        const result = await this.docClient.delete({
            TableName: this.entriesTable,
            Key: {
                "userId": userId,
                "entryId": entryId
            },
            ReturnValues: 'ALL_OLD'             
        }).promise()

        logger.info('Delete an entry', {
            deletedEntry: result
          })

        return entryId
    }
    
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    const XAWS = AWSXRay.captureAWS(AWS)
    return new XAWS.DynamoDB.DocumentClient()
}