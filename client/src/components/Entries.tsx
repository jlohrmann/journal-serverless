import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createEntry, deleteEntry, getEntries, patchEntry } from '../api/entries-api'
import Auth from '../auth/Auth'
import { Entry } from '../types/Entry'

interface EntriesProps {
  auth: Auth
  history: History
}

interface EntriesState {
  entries: Entry[]
  newEntryText: string
  loadingEntries: boolean
}

export class Entries extends React.PureComponent<EntriesProps, EntriesState> {
  state: EntriesState = {
    entries: [],
    newEntryText: '',
    loadingEntries: true
  }

  handleEntryTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newEntryText: event.target.value })
  }

  onEditButtonClick = (entryId: string) => {
    this.props.history.push(`/entries/${entryId}/edit`)
  }

  onEntryCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const reviewByDate = this.calculateDueDate()
      const newEntry = await createEntry(this.props.auth.getIdToken(), {
        entryText: this.state.newEntryText,
        reviewByDate
      })
      this.setState({
        entries: [...this.state.entries, newEntry],
        newEntryText: ''
      })
    } catch {
      alert('Entry creation failed')
    }
  }

  onEntryDelete = async (entryId: string) => {
    try {
      await deleteEntry(this.props.auth.getIdToken(), entryId)
      this.setState({
        entries: this.state.entries.filter(entry => entry.entryId != entryId)
      })
    } catch {
      alert('Entry deletion failed')
    }
  }

  onEntryCheck = async (pos: number) => {
    try {
      const entry = this.state.entries[pos]
      await patchEntry(this.props.auth.getIdToken(), entry.entryId, {
        entryText: entry.entryText,
        reviewByDate: entry.reviewByDate,
        readyToPublish: !entry.readyToPublish
      })
      this.setState({
        entries: update(this.state.entries, {
          [pos]: { readyToPublish: { $set: !entry.readyToPublish } }
        })
      })
    } catch {
      alert('Entry update to done failed')
    }
  }

  async componentDidMount() {
    try {
      const entries = await getEntries(this.props.auth.getIdToken())
      this.setState({
        entries,
        loadingEntries: false
      })
    } catch (e) {
      alert(`Failed to fetch entries: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Entries</Header>

        {this.renderCreateEntryInput()}

        {this.renderEntries()}
      </div>
    )
  }

  renderCreateEntryInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New entry',
              onClick: this.onEntryCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Enter a new joural entry..."
            onChange={this.handleEntryTextChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderEntries() {
    if (this.state.loadingEntries) {
      return this.renderLoading()
    }

    return this.renderEntriesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Entries
        </Loader>
      </Grid.Row>
    )
  }

  renderEntriesList() {
    return (
      <Grid padded>
        {this.state.entries.map((entry, pos) => {
          return (
            <Grid.Row key={entry.entryId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onEntryCheck(pos)}
                  checked={entry.readyToPublish}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {entry.entryText}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {entry.reviewByDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(entry.entryId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onEntryDelete(entry.entryId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {entry.attachmentUrl && (
                <Image src={entry.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'mm/dd/yyyy') as string
  }
}
