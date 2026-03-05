import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

export default class Transaction extends Component {
  state = {
    items: [
      {
        id: 1,
        item_id: "",
        name: "",
        units: 0,
        price: 0,
        qty: 0,
      },
    ],
    notes: "",
    date: "",
    transaction_id: "",
    special_id: 0,
    inv: [],
    customer_name: "",
    customer_address: "",
    customer_contact_number: "",
    delivery_fee: 0,
    discount: 0,
    isSubmitting: false,
  };

  axiosCreate() {
    let axiosReq = axios.create({
      baseURL: this.props.url,
    });
    return axiosReq;
  }

  generateInventoryItems() {
    this.axiosCreate()
      .get("inventory")
      .then((res) => {
        this.setState({ inv: res.data.data });
      });
  }

  componentDidMount() {
    document.title = "Transaction";
    this.generateInventoryItems();
    var date = new Date();
    var date_now =
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2);
    this.setState({ date: date_now });
  }

  handleAddRow(id) {
    let items = this.state.items;
    let new_items = items;
    new_items.push({
      id: id,
      item_id: "",
      name: "",
      units: 0,
      price: 0,
      qty: 0,
    });
    let renew_id = [];
    for (var counter in new_items) {
      var new_data = {
        id: parseInt(counter) + 1,
        item_id: "",
        name: "",
        units: 0,
        price: 0,
        qty: 0,
      };
      renew_id.push(new_data);
    }
    this.setState({ items: new_items });
  }

  handleInputChange(e, index, type) {
    var items = this.state.items;
    var inv = this.state.inv;
    items[index][type] = e.target.value;
    var get_index = -1;

    if (type === "units" || type === "name") {
      get_index = this.state.inv
        .map((e) => e.item_name)
        .indexOf(items[index]["name"]);
    }

    if (
      (type === "units" && get_index !== -1) ||
      (type === "name" && get_index !== -1)
    ) {
      items[index]["price"] =
        inv[get_index]["selling_price"] * items[index]["units"];
      items[index]["qty"] = inv[get_index]["current_inventory"];
      items[index]["item_id"] = inv[get_index]["item_id"];
    }

    if (e.target.value === "" && type === "name") {
      items[index]["price"] = 0;
      items[index]["qty"] = 0;
      items[index]["item_id"] = "";
    }

    this.setState({ items: items });
  }

  handleRemoveRow(id) {
    var data = this.state.items;
    delete data[id - 1];
    this.setState({ items: data });
  }

  handleNotes(e) {
    this.setState({ notes: e.target.value });
  }

  handlerCalendarChange(e) {
    this.setState({ date: e.target.value });
  }

  handleTransactionIDChange(e) {
    this.setState({ transaction_id: e.target.value });
  }

  handleCustomerNameChange(e) {
    this.setState({ customer_name: e.target.value });
  }

  handleCustomerAddressChange(e) {
    this.setState({ customer_address: e.target.value });
  }

  handleCustomerContactChange(e) {
    this.setState({ customer_contact_number: e.target.value });
  }

  handleDeliveryFeeChange(e) {
    this.setState({ delivery_fee: e.target.value });
  }

  handleDeliveryFeeBlur() {
    this.setState({ delivery_fee: parseFloat(this.state.delivery_fee) || 0 });
  }

  handleDiscountChange(e) {
    this.setState({ discount: e.target.value });
  }

  handleDiscountBlur() {
    this.setState({ discount: parseFloat(this.state.discount) || 0 });
  }

  continueTransactionProcess(special_id) {
    var data = this.state;
    var special_id = special_id;

    try {
      let transaction_details = [];
      let inventory = [];

      for (var item in data.items) {
        var inv_index = this.state.inv
          .map((e) => e.item_name)
          .indexOf(data.items[item]["name"]);
        var inv_item_details = this.state.inv[inv_index];
        var json_item = {
          item_id: inv_item_details.item_id,
          special_id: special_id,
          item_name: inv_item_details.item_name,
          units_sold: parseInt(data.items[item]["units"]),
          selling_price: inv_item_details.selling_price,
          total_price: data.items[item]["price"],
        };

        let new_inventory =
          parseInt(inv_item_details.current_inventory) -
          parseInt(data.items[item]["units"]);
        let inv_data = {
          item_id: json_item.item_id,
          current_inventory: new_inventory,
        };
        transaction_details.push(json_item);
        inventory.push(inv_data);
      }

      let post_data = {
        transaction_details: transaction_details,
        new_inventory: inventory,
      };

      this.axiosCreate()
        .post("transactions/create", JSON.stringify(post_data))
        .then((res) => {
          this.props.tools.swal
            .fire("Success!", "Transaction Success!", "success")
            .then(() => {
              window.location.reload(false);
            });
        })
        .catch((err) => {
          this.setState({ isSubmitting: false });
          const description =
            err.response?.data?.description ||
            "Transaction failed due to insufficient stock. Please refresh and try again.";
          this.props.tools.swal.fire("Error!", description, "error");
        });
    } catch (e) {
      console.log(e);
      this.setState({ isSubmitting: false });
      alert("Process Error!");
    }
  }

  handleSubmitForm = (event) => {
    event.preventDefault();
    if (this.state.isSubmitting) return;
    var data = this.state;
    var items = data.items;
    var items_info = [];
    var count = {};
    var has_duplicate = false;
    var invalid_qty = false;
    var zero_units_or_price = false;

    for (var item in items) {
      items_info.push(items[item]["item_id"]);
    }

    items_info.forEach(function (i) {
      count[i] = (count[i] || 0) + 1;
    });

    for (var c in count) {
      if (count[c] > 1) {
        has_duplicate = true;
      }
    }

    for (var c in items) {
      if (
        items[c]["qty"] <= 0 ||
        parseInt(items[c]["units"]) > items[c]["qty"]
      ) {
        invalid_qty = true;
      }
      if (
        parseInt(items[c]["units"]) <= 0 ||
        parseFloat(items[c]["price"]) <= 0
      ) {
        zero_units_or_price = true;
      }
    }

    if (
      has_duplicate === false &&
      invalid_qty === false &&
      zero_units_or_price === false
    ) {
      var items_total = data.items
        .map((e) => parseFloat(e.price))
        .reduce((a, b) => a + b, 0);
      var total_price =
        items_total +
        parseFloat(data.delivery_fee || 0) -
        parseFloat(data.discount || 0);
      var json = {
        transaction_id: data.transaction_id,
        total_price: total_price,
        notes: data.notes,
        transaction_date: data.date,
        customer_name: data.customer_name,
        customer_address: data.customer_address,
        customer_contact_number: data.customer_contact_number,
        delivery_fee: data.delivery_fee,
        discount: data.discount,
      };

      this.props.tools.swal
        .fire({
          title: "Are you sure?",
          html: `You are about to submit a transaction with a total of <strong>${total_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>. This action cannot be undone.`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, submit it!",
          cancelButtonText: "Cancel",
        })
        .then((result) => {
          if (!result.isConfirmed) return;
          this.setState({ isSubmitting: true });
          setTimeout(() => {
            this.axiosCreate()
              .post("transactions", json)
              .then((res) => {
                this.continueTransactionProcess(res.data.data.special_id);
              })
              .catch(() => {
                this.setState({ isSubmitting: false });
              });
          }, 1000);
        });
      return;
    } else if (has_duplicate === true) {
      this.props.tools.swal.fire(
        "Error!",
        "There are duplicate items in your transaction",
        "error",
      );
    } else if (invalid_qty === true) {
      this.props.tools.swal.fire(
        "Error!",
        "Some items are out of stock or do not have enough quantity to satisfy this transaction",
        "error",
      );
    } else if (zero_units_or_price === true) {
      this.props.tools.swal.fire(
        "Error!",
        "Quantity and price must be greater than 0",
        "error",
      );
    } else {
      this.props.tools.swal.fire(
        "Error!",
        "Your transaction is invalid, please check your data!",
        "error",
      );
    }
  };

  render() {
    return (
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h4 className="m-2 font-weight-bold text-primary">TRANSACTION</h4>
        </div>
        <div className="card-body">
          <form id="add_trans" onSubmit={this.handleSubmitForm}>
            <div className="table-responsive">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="receipt_number" style={{ color: "black" }}>
                      Receipt Number
                    </label>
                    <input
                      onChange={(e) => this.handleTransactionIDChange(e)}
                      className="form-control form-control-md"
                      type="text"
                      id="trans_id"
                      name="trans_id"
                      placeholder="RECEIPT NUMBER"
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="date" style={{ color: "black" }}>
                      Date
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-md"
                      name="dates"
                      value={this.state.date}
                      onChange={(e) => this.handlerCalendarChange(e)}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="customer_name" style={{ color: "black" }}>
                      Customer Name
                    </label>
                    <input
                      onChange={(e) => this.handleCustomerNameChange(e)}
                      className="form-control form-control-md"
                      type="text"
                      id="customer_name"
                      name="customer_name"
                      placeholder="CUSTOMER NAME"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      htmlFor="customer_address"
                      style={{ color: "black" }}
                    >
                      Customer Address
                    </label>
                    <input
                      onChange={(e) => this.handleCustomerAddressChange(e)}
                      className="form-control form-control-md"
                      type="text"
                      id="customer_address"
                      name="customer_address"
                      placeholder="CUSTOMER ADDRESS"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      htmlFor="customer_contact_number"
                      style={{ color: "black" }}
                    >
                      Customer Contact Number
                    </label>
                    <input
                      onChange={(e) => this.handleCustomerContactChange(e)}
                      className="form-control form-control-md"
                      type="text"
                      id="customer_contact_number"
                      name="customer_contact_number"
                      placeholder="CUSTOMER CONTACT NUMBER"
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="delivery_fee" style={{ color: "black" }}>
                      Delivery Fee
                    </label>
                    <input
                      onChange={(e) => this.handleDeliveryFeeChange(e)}
                      onBlur={() => this.handleDeliveryFeeBlur()}
                      className="form-control form-control-md"
                      type="number"
                      id="delivery_fee"
                      name="delivery_fee"
                      placeholder="DELIVERY FEE"
                      min="0"
                      value={this.state.delivery_fee}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="discount" style={{ color: "black" }}>
                      Discount
                    </label>
                    <input
                      onChange={(e) => this.handleDiscountChange(e)}
                      onBlur={() => this.handleDiscountBlur()}
                      className="form-control form-control-md"
                      type="number"
                      id="discount"
                      name="discount"
                      placeholder="DISCOUNT"
                      min="0"
                      value={this.state.discount}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" style={{ color: "black" }}>
                    Notes
                  </label>
                  <textarea
                    onChange={(e) => this.handleNotes(e)}
                    rows="2"
                    id="notes"
                    cols="100%"
                    name="notes"
                    form="add_trans"
                    placeholder="Enter Notes here"
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      padding: "8px",
                    }}
                  ></textarea>
                </div>
              </div>

              <br />

              <table className="table table-bordered" id="dynamic_field">
                <thead>
                  <tr>
                    <th style={{ verticalAlign: "middle" }}>Item Name</th>
                    <th style={{ verticalAlign: "middle" }}>Quantity</th>
                    <th style={{ verticalAlign: "middle" }}>Price</th>
                    <th style={{ verticalAlign: "middle" }}>
                      Available Quantity
                    </th>
                    <th
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      <button
                        id="transaction-add-more-btn"
                        type="button"
                        onClick={() => this.handleAddRow()}
                        className="btn btn-success"
                      >
                        +
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.items.map((list, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          placeholder="Item Name"
                          onChange={(e) =>
                            this.handleInputChange(e, index, "name")
                          }
                          value={this.state.items[index].name || ""}
                          className="form-control"
                          list="inventory"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          onChange={(e) =>
                            this.handleInputChange(e, index, "units")
                          }
                          value={this.state.items[index].units || 0}
                          placeholder="Quantity"
                          className="form-control name_list"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control name_list"
                          onChange={(e) =>
                            this.handleInputChange(e, index, "price")
                          }
                          onBlur={() => {
                            var items = this.state.items;
                            items[index]["price"] =
                              parseFloat(items[index]["price"]) || 0;
                            this.setState({ items });
                          }}
                          value={this.state.items[index].price}
                          required
                        />
                      </td>
                      <td
                        className="qty-cell"
                        style={{ verticalAlign: "start", textAlign: "left" }}
                      >
                        <span>
                          Available Quantity: {this.state.items[index].qty}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => this.handleRemoveRow(index + 1)}
                          type="button"
                          className="btn btn-danger btn_remove"
                          disabled={
                            this.state.items.filter(Boolean).length <= 1
                          }
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="5" style={{ textAlign: "right" }}>
                      Total Price:{" "}
                      {(
                        this.state.items
                          .map((e) => parseFloat(e.price))
                          .reduce((a, b) => a + b, 0) +
                        this.state.delivery_fee -
                        this.state.discount
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={this.state.isSubmitting}
              >
                {this.state.isSubmitting
                  ? "Submitting..."
                  : "SUBMIT TRANSACTION"}
              </button>
            </div>
            <datalist id="inventory">
              {this.state.inv.map((list, index) => (
                <option value={list.item_name} key={index}>
                  {list.item_name}
                </option>
              ))}
            </datalist>
          </form>
        </div>
      </div>
    );
  }
}
