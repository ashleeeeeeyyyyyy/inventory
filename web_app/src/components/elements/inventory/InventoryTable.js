import React, { Component } from "react";
import { MDBDataTable, MDBBtn } from "mdbreact";
import AddInventory from "./AddInventory.js";

export default class InventoryTable extends Component {
  state = {
    inventory: {},
    edit_data: {
      item_id: "",
      spec_code: "",
      item_name: "",
      category: "",
      buying_price: 0,
      selling_price: 0,
      current_inventory: 0,
    },
    id: "",
    old_data: {},
    isLoading: false,
  };

  handleAddModal(item) {
    this.setState({ inventory: item });
  }

  handleEditModal(data) {
    let id = data.item_id;
    this.setState({
      id: id,
      edit_data: {
        item_id: data.item_id,
        spec_code: data.spec_code,
        item_name: data.item_name,
        category: data.category,
        buying_price: data.buying_price,
        selling_price: data.selling_price,
        current_inventory: data.current_inventory,
      },
      old_data: {
        item_id: data.item_id,
        spec_code: data.spec_code,
        item_name: data.item_name,
        category: data.category,
        buying_price: data.buying_price,
        selling_price: data.selling_price,
        current_inventory: data.current_inventory,
      },
    });
  }

  handleFormChanges(e, type) {
    let data_set = this.state.edit_data;
    let new_data = {
      item_id: data_set.item_id,
      spec_code: data_set.spec_code,
      item_name: data_set.item_name,
      category: data_set.category,
      buying_price: data_set.buying_price,
      selling_price: data_set.selling_price,
      current_inventory: data_set.current_inventory,
    };
    new_data[type] = e.target.value;
    this.setState({ edit_data: new_data });
  }

  handleFormReset = (event) => {
    let old_data = this.state.old_data;
    this.setState({ edit_data: old_data });
    event.preventDefault();
  };

  handleFormSubmit = (event) => {
    this.setState({ isLoading: true });
    let new_url = "inventory/" + this.state.id;
    let data = this.state.edit_data;
    setTimeout(() => {
      this.props.req.put(new_url, data).then(() => {
        this.setState({ isLoading: false });
        this.props.tools.swal
          .fire("Success!", "Inventory Updated!", "success")
          .then(() => {
            window.location.reload(false);
          });
      });
    }, 1000);
    event.preventDefault();
  };

  handleDeleteItem(data) {
    let new_url = "inventory/" + data.item_id;
    this.props.tools.swal
      .fire({
        title: "Are you sure?",
        text: "Item will be deleted",
        type: "warning",
        showCancelButton: true,
      })
      .then((res) => {
        if (res["value"] === true) {
          this.setState({ isLoading: true });
          this.props.tools.swal.fire({
            title: "Deleting...",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
              this.props.tools.swal.showLoading();
            },
          });
          setTimeout(() => {
            this.props.req
              .delete(new_url)
              .then(() => {
                this.setState({ isLoading: false });
                this.props.tools.swal
                  .fire("Success!", "Item Deleted!", "success")
                  .then(() => {
                    window.location.reload(false);
                  });
              })
              .catch(() => {
                this.setState({ isLoading: false });
                this.props.tools.swal
                  .fire(
                    "Error!",
                    "Item was not deleted because there is an error!",
                    "error",
                  )
                  .then(() => {
                    window.location.reload(false);
                  });
              });
          }, 1000);
        } else {
          this.props.tools.swal.fire(
            "Cancelled",
            "The items was not removed!",
            "info",
          );
        }
      });
  }

  render() {
    const row_data = this.props.data_set;

    for (var item in row_data) {
      let data = row_data[item];
      row_data[item]["add"] = (
        <MDBBtn
          onClick={() => this.handleAddModal(data)}
          className="btn btn-primary btn-block"
          data-toggle="modal"
          data-target="#AddToInvModal"
        >
          ADD
        </MDBBtn>
      );
      row_data[item]["edit"] = (
        <MDBBtn
          onClick={() => this.handleEditModal(data)}
          className="btn btn-primary btn-block"
          data-toggle="modal"
          data-target="#EditModal"
        >
          EDIT
        </MDBBtn>
      );
      row_data[item]["delete"] = (
        <MDBBtn
          onClick={() => this.handleDeleteItem(data)}
          className="btn btn-primary btn-block"
        >
          DELETE
        </MDBBtn>
      );
    }

    const data = {
      columns: [
        {
          label: "CODE",
          field: "item_id",
          sort: "asc",
          width: 150,
        },
        {
          label: "SPECIAL CODE",
          field: "spec_code",
          sort: "asc",
        },
        {
          label: "ITEM",
          field: "item_name",
          sort: "asc",
        },
        {
          label: "CATEGORY",
          field: "category",
          sort: "asc",
        },
        {
          label: "BUYING PRICE",
          field: "buying_price",
          sort: "asc",
        },
        {
          label: "SELLING PRICE",
          field: "selling_price",
          sort: "asc",
        },
        {
          label: "QUANTITY",
          field: "current_inventory",
          sort: "asc",
        },
        {
          label: "ADD TO INVENTORY",
          field: "add",
          sort: "asc",
        },
        {
          label: "EDIT",
          field: "edit",
          sort: "asc",
        },
        {
          label: "DELETE",
          field: "delete",
          sort: "asc",
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
          id="EditModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="EditModal"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  EDIT PRODUCT WITH CODE : {this.state.id}
                </h5>
                <button
                  className="close"
                  type="button"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form
                id="Inventory-Edit"
                onReset={this.handleFormReset}
                onSubmit={this.handleFormSubmit}
              >
                <div className="modal-body">
                  <div className="form-group">
                    <label>ITEM CODE</label>
                    <input
                      className="form-control"
                      onChange={(e) => this.handleFormChanges(e, "item_id")}
                      value={this.state.edit_data.item_id || ""}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>SPECIAL CODE</label>
                    <input
                      className="form-control"
                      onChange={(e) => this.handleFormChanges(e, "spec_code")}
                      value={this.state.edit_data.spec_code || ""}
                    />
                  </div>

                  <div className="form-group">
                    <label>ITEM NAME</label>
                    <input
                      className="form-control"
                      onChange={(e) => this.handleFormChanges(e, "item_name")}
                      value={this.state.edit_data.item_name || ""}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>ITEM CATEGORY</label>
                    <input
                      className="form-control"
                      onChange={(e) => this.handleFormChanges(e, "category")}
                      value={this.state.edit_data.category || ""}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>BUYING PRICE</label>
                    <input
                      type="number"
                      max="99999"
                      className="form-control"
                      onChange={(e) =>
                        this.handleFormChanges(e, "buying_price")
                      }
                      value={this.state.edit_data.buying_price || ""}
                      step="0.01"
                      min="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>SELLING PRICE</label>
                    <input
                      type="number"
                      max="99999"
                      className="form-control"
                      onChange={(e) =>
                        this.handleFormChanges(e, "selling_price")
                      }
                      value={this.state.edit_data.selling_price || ""}
                      step="0.01"
                      min="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>ITEM QUANTITY</label>
                    <input
                      type="number"
                      className="form-control"
                      onChange={(e) =>
                        this.handleFormChanges(e, "current_inventory")
                      }
                      value={this.state.edit_data.current_inventory || ""}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={this.state.isLoading}
                  >
                    <i className="fa fa-check fa-fw"></i>
                    {this.state.isLoading ? "Saving..." : "Save"}
                  </button>
                  <button type="reset" className="btn btn-danger">
                    <i className="fa fa-times fa-fw"></i>Reset
                  </button>
                  <button className="btn btn-secondary" data-dismiss="modal">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <AddInventory
          tools={this.props.tools}
          add_inv={this.state.inventory}
          req={this.props.req}
        ></AddInventory>
      </div>
    );
  }
}
