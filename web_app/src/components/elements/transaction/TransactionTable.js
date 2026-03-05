import React, { Component } from "react";
import { MDBDataTable, MDBBtn } from "mdbreact";

export default class TransactionTable extends Component {
  state = {
    transactions: [],
    transaction_details: {},
    total_price: 0.0,
    modalLoading: false,
  };

  handleModalState(data) {
    this.setState({ transaction_details: data, modalLoading: true });
    this.props.req
      .get("tdetails", {
        params: {
          special_id: data.special_id,
        },
      })
      .then((res) => {
        var data = res.data.data;
        var total = data
          .map((e) => parseFloat(e.total_price))
          .reduce((a, b) => a + b, 0);
        this.setState({
          transactions: data,
          total_price: total,
          modalLoading: false,
        });
      });
  }

  render() {
    const row_data = this.props.data_set;

    for (var item in row_data) {
      let data = row_data[item];
      row_data[item]["total_price_display"] = parseFloat(
        data.total_price || 0,
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      row_data[item]["details"] = (
        <MDBBtn
          className="btn btn-primary btn-block"
          onClick={() => this.handleModalState(data)}
          data-toggle="modal"
          data-target="#TDetailsModal"
        >
          DETAILS
        </MDBBtn>
      );
    }

    const data = {
      columns: [
        {
          label: "RECEIPT NUMBER",
          field: "transaction_id",
        },
        {
          label: "CUSTOMER NAME",
          field: "customer_name",
        },
        {
          label: "CUSTOMER ADDRESS",
          field: "customer_address",
        },
        {
          label: "CUSTOMER CONTACT",
          field: "customer_contact_number",
        },
        {
          label: "TRANSACTION DATE",
          field: "transaction_date",
          sort: "desc",
        },
        {
          label: "TOTAL PRICE",
          field: "total_price_display",
        },
        {
          label: "NOTES",
          field: "notes",
        },
        {
          label: "OPTIONS",
          field: "details",
        },
      ],
      rows: row_data,
    };

    return (
      <div>
        <MDBDataTable
          striped
          hover
          data={data}
          entries={10}
          entriesOptions={[10, 25, 50]}
          noBottomColumns
          btn
        />
        <div
          className="modal fade"
          id="TDetailsModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="TDetailsModal"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  DETAILS
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {this.state.modalLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading details...</p>
                  </div>
                ) : (
                  <>
                    <table className="table table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Receipt Number</strong>
                          </td>
                          <td>
                            {this.state.transaction_details.transaction_id}
                          </td>
                          <td>
                            <strong>Customer Name</strong>
                          </td>
                          <td>
                            {this.state.transaction_details.customer_name}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Customer Address</strong>
                          </td>
                          <td>
                            {this.state.transaction_details.customer_address}
                          </td>
                          <td>
                            <strong>Customer Contact</strong>
                          </td>
                          <td>
                            {
                              this.state.transaction_details
                                .customer_contact_number
                            }
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Transaction Date</strong>
                          </td>
                          <td>
                            {this.state.transaction_details.transaction_date}
                          </td>
                          <td>
                            <strong>Total Price</strong>
                          </td>
                          <td>
                            {parseFloat(
                              this.state.transaction_details.total_price || 0,
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Delivery Fee</strong>
                          </td>
                          <td>
                            {parseFloat(
                              this.state.transaction_details.delivery_fee || 0,
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td>
                            <strong>Discount</strong>
                          </td>
                          <td>
                            {parseFloat(
                              this.state.transaction_details.discount || 0,
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Notes</strong>
                          </td>
                          <td colSpan="3">
                            {this.state.transaction_details.notes}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <hr />
                    <table className="table table-hover table-dark table-striped table-sm">
                      <thead>
                        <tr>
                          <th>ITEM ID</th>
                          <th>ITEM NAME</th>
                          <th>UNITS SOLD</th>
                          <th>PRICE PER UNIT</th>
                          <th>TOTAL PRICE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.transactions.map((list, index) => (
                          <tr key={index}>
                            <td>{list.item_id}</td>
                            <td>{list.item_name}</td>
                            <td>{list.units_sold}</td>
                            <td>
                              {parseFloat(list.selling_price).toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </td>
                            <td>
                              {parseFloat(list.total_price).toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="3"></td>
                          <td>Subtotal:</td>
                          <td>
                            {parseFloat(this.state.total_price).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3"></td>
                          <td>Delivery Fee:</td>
                          <td>
                            {parseFloat(
                              this.state.transaction_details.delivery_fee || 0,
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3"></td>
                          <td>Discount:</td>
                          <td>
                            {parseFloat(
                              this.state.transaction_details.discount || 0,
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3"></td>
                          <td>
                            <strong>Total Price:</strong>
                          </td>
                          <td>
                            <strong>
                              {parseFloat(
                                this.state.transaction_details.total_price || 0,
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
