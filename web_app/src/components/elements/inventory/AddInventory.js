import React, { Component } from 'react';

export default class AddInventory extends Component {

    state = {
        value: 0,
        isLoading: false
    }

    handleChange(e) {
        this.setState({ value: e.target.value })
    }

    submitReq() {
        this.setState({ isLoading: true })
        let new_url = 'inventory/' + this.props.add_inv.item_id
        let new_inventory = parseInt(this.props.add_inv.current_inventory) + parseInt(this.state.value)
        let data = {
            current_inventory: new_inventory
        }
        setTimeout(() => {
            this.props.req.put(new_url, data).then(() => {
                this.setState({ isLoading: false })
                this.props.tools.swal.fire('Success!', 'Inventory Updated!', 'success').then(() => {
                    window.location.reload(false);
                })
            })
        }, 1000)
    }

    resetState() {
        this.setState({ value: 0 })
    }

    ModalClose() {
        if (!document.getElementById('AddToInvModal').classList.contains('show')) {
            this.setState({ value: 0 })
        }
    }

    render() {
        let modal_data = this.props.add_inv

        return (
            <div className='modal fade' id='AddToInvModal' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true' onClick={() => this.ModalClose()}>
                <div className='modal-dialog modal-dialog-centered modal-lg' role='document'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='exampleModalLabel'>ADD INVENTORY TO {modal_data.item_id}-{modal_data.item_name}</h5>
                            <button onClick={() => this.resetState()} className='close' type='button' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>×</span>
                            </button>
                        </div>

                        <div className='modal-body'>
                            <input type='number' value={this.state.value} onChange={e => this.handleChange(e)} />
                            <button className='btn btn-primary' onClick={() => this.submitReq()} disabled={this.state.isLoading}>
                                <svg className='bi bi-plus-circle-fill' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                                    <path fillRule='evenodd' d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4a.5.5 0 0 0-1 0v3.5H4a.5.5 0 0 0 0 1h3.5V12a.5.5 0 0 0 1 0V8.5H12a.5.5 0 0 0 0-1H8.5V4z' />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}