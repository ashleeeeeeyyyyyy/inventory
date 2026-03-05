import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import TransactionTable from "../elements/transaction/TransactionTable.js";

export default class TrasactionDetails extends Component {
  state = {
    transactions: [],
    loading: true,
  };

  axiosCreate() {
    let axiosReq = axios.create({
      baseURL: this.props.url,
    });
    return axiosReq;
  }

  generateTableData() {
    this.axiosCreate()
      .get("transactions")
      .then((res) => {
        const sorted = (res.data.data || [])
          .slice()
          .sort(
            (a, b) =>
              new Date(b.transaction_date) - new Date(a.transaction_date),
          );
        this.setState({ transactions: sorted, loading: false });
      });
  }

  componentDidMount() {
    document.title = "Transaction Details";
    this.generateTableData();
  }

  render() {
    return (
      <div>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h4 className="m-2 font-weight-bold text-primary">
              TRANSACTION DETAILS
            </h4>
          </div>
          <div className="card-body">
            {this.state.loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading transactions...</p>
              </div>
            ) : (
              <TransactionTable
                data_set={this.state.transactions}
                req={this.axiosCreate()}
              ></TransactionTable>
            )}
          </div>
        </div>
      </div>
    );
  }
}
