import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Sidebar extends Component {
  render() {
    return (
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        <hr className="sidebar-divider my-0" />
        <li className="nav-item">
          <a className="nav-link" href="">
            <i className="fas fa-fw fa-home"></i>
            <span>Home</span>
          </a>
        </li>
        <hr className="sidebar-divider" />

        <li className="nav-item">
          <a className="nav-link" href="/Inventory">
            <i className="fas fa-fw fa-archive"></i>
            <span>Inventory</span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/Transaction">
            <i className="fas fa-fw fa-retweet"></i>
            <span>Transaction</span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/TransactionDetails">
            <i className="fas fa-fw fa-retweet"></i>
            <span>Transaction Details</span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/Employees">
            <i className="fas fa-fw fa-users"></i>
            <span>Employees</span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/Suppliers">
            <i className="fas fa-fw fa-users"></i>
            <span>Supplier</span>
          </a>
        </li>

        <hr className="sidebar-divider d-none d-md-block" />
        <div className="text-center d-none d-md-inline">
          <button
            className="rounded-circle border-0"
            id="sidebarToggle"
          ></button>
        </div>
      </ul>
    );
  }
}
