import React, { Component } from 'react';
import Record from './Record';
import RecordForm from './RecordForm'
import AmountBox from './AmountBox'
import * as RecordsAPI from '../utils/RecordsAPI'

export default class Records extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      isLoad: false,
      records: []
    }
  }

  componentDidMount(){
    RecordsAPI.getAll().then(
      response => this.setState({
        records: response.data,
        isLoad: true
      }),
    ).catch(
      error => this.setState({
        isLoad: true,
        error
      })
    )
  }

  addRecord(record) {
    this.setState({
      error: null,
      isLoad: true,
      records: [
        ...this.state.records,
        record
      ]
    })
  }

  updateRecord(record, data) {
    const recordIndex = this.state.records.indexOf(record);
    const newRecords = this.state.records.map((item, index) => {
      if (index !== recordIndex) {
        return item;
      }
      return {
        ...item,
        ...data
      };
    });
    this.setState({
      records: newRecords
    })
  }

  deleteRecord(record) {
    const recordIndex = this.state.records.indexOf(record);
    const newRecords = this.state.records.filter((item, index) => index !== recordIndex)
    this.setState({
      records: newRecords
    })
  }

  credits(){
    let credits = this.state.records.filter((record) => {
      return record.amount >= 0;
    })
    return credits.reduce((prev, curr) => {
      return prev + Number.parseInt(curr.amount, 0)
    }, 0)
  }

  debits() {
    let credits = this.state.records.filter((record) => {
      return record.amount < 0;
    })
    return credits.reduce((prev, curr) => {
      return prev + Number.parseInt(curr.amount, 0)
    }, 0)
  }

  balance() {
    return this.credits() + this.debits();
  }

  render() {
    const { error, isLoad, records } = this.state;
    let recordsComponent;

    if (error) {
      recordsComponent = <div>Error: {error.message}</div>;
    }else if (!isLoad) {
      recordsComponent =  <div>Loading...</div>;
    } else {
      recordsComponent = (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) =>
              <Record
                key={record.id}
                record={record}
                handleEditRecord={this.updateRecord.bind(this)}
                handleDeleteRecord={this.deleteRecord.bind(this)}
              />
            )}
          </tbody>
        </table>
      );
    }
    return (
      <div>
        <h2>个人财务收支账单</h2>
        <div className="row mb-3">
          <AmountBox text="Credit" type="success" amount={this.credits()}/>
          <AmountBox text="Debit" type="danger" amount={this.debits()}/>
          <AmountBox text="Balance" type="info" amount={this.balance()}/>
        </div>
        <RecordForm handleNewRecord={this.addRecord.bind(this)}/>
        {recordsComponent}
      </div>
    )
  }
}
