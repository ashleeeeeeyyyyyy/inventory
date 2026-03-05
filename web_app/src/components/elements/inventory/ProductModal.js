import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ProductModal extends Component {


    state = {
        isLoading: false,
        edit_data: {
            item_id: '',
            spec_code: '',
            item_name: '',
            category: '',
            buying_price: 0,
            selling_price: 0,
            current_inventory: 0
        }
    }

    handleFormChanges(e, type) {
        let data_set = this.state.edit_data
        let new_data = {
            item_id: data_set.item_id,
            spec_code: data_set.spec_code,
            item_name: data_set.item_name,
            category: data_set.category,
            buying_price: data_set.buying_price,
            selling_price: data_set.selling_price,
            current_inventory: data_set.current_inventory
        }
        new_data[type] = e.target.value
        this.setState({ edit_data: new_data })
    }

    handleFormReset = event => {
        let fresh_data = {
            item_id: '',
            spec_code: '',
            item_name: '',
            category: '',
            buying_price: 0,
            selling_price: 0,
            current_inventory: 0
        }
        this.setState({ edit_data: fresh_data })
        event.preventDefault()
    }

    handleFormSubmit = event => {
        this.setState({ isLoading: true })
        let new_url = 'inventory'
        let data = this.state.edit_data
        setTimeout(() => {
            this.props.req.post(new_url, data).then(() => {
                this.setState({ isLoading: false })
                this.props.tools.swal.fire('Success!', 'Inventory Updated!', 'success').then(() => {
                    window.location.reload(false);
                })
            }).catch(error => {
                this.setState({ isLoading: false })
                if(error.response.status === 409) {
                    this.props.tools.swal.fire('Error!', 'An item with code ' + data.item_id + ' already exist!', 'error')
                }
            })
        }, 1000)
        event.preventDefault()
    }

    render() {
        return (
            <div className="modal fade" id="aModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className='modal-dialog modal-dialog-centered modal-lg' role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">ADD PRODUCT TO INVENTORY</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form id="Inventory-Add-New" onReset={this.handleFormReset} onSubmit={this.handleFormSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>ITEM CODE</label>
                                        <input className="form-control" onChange={e => this.handleFormChanges(e, 'item_id')} value={this.state.edit_data.item_id || ''} required />
                                    </div>

                                    <div className="form-group">
                                        <label>SPECIAL CODE</label>
                                        <input className="form-control" onChange={e => this.handleFormChanges(e, 'spec_code')} value={this.state.edit_data.spec_code || ''} />
                                    </div>

                                    <div className="form-group">
                                        <label>ITEM NAME</label>
                                        <input className="form-control" onChange={e => this.handleFormChanges(e, 'item_name')} value={this.state.edit_data.item_name || ''} required />
                                    </div>

                                    <div className="form-group">
                                        <label>ITEM CATEGORY</label>
                                        <input className="form-control" onChange={e => this.handleFormChanges(e, 'category')} value={this.state.edit_data.category || ''} required />
                                    </div>

                                    <div className="form-group">
                                        <label>BUYING PRICE</label>
                                        <input type="number" max="99999" className="form-control" onChange={e => this.handleFormChanges(e, 'buying_price')} value={this.state.edit_data.buying_price || ''} step="0.01" min="0.01" required />
                                    </div>

                                    <div className="form-group">
                                        <label>SELLING PRICE</label>
                                        <input type="number" max="99999" className="form-control" onChange={e => this.handleFormChanges(e, 'selling_price')} value={this.state.edit_data.selling_price || ''} step="0.01" min="0.01" required />
                                    </div>

                                    <div className="form-group">
                                        <label>ITEM QUANTITY</label>
                                        <input type="number" className="form-control" onChange={e => this.handleFormChanges(e, 'current_inventory')} value={this.state.edit_data.current_inventory || ''} required />
                                    </div>

                                    <button type="submit" className="btn btn-success" disabled={this.state.isLoading}><i className="fa fa-check fa-fw"></i>{this.state.isLoading ? 'Saving...' : 'Save'}</button>
                                    <button type="reset" className="btn btn-danger"><i className="fa fa-times fa-fw"></i>Reset</button>
                                    <button className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}