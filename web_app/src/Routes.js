import React from "react";
import AppliedRoute from "./components/AppliedRoute.js";
import { Switch, Redirect } from "react-router-dom";
import Home from "./components/pages/Home.js";
import Login from "./components/pages/Login.js";
import Inventory from "./components/pages/Inventory.js";
import Transaction from "./components/pages/Transaction.js";
import TransactionDetails from "./components/pages/TransactionDetails.js";
import Employees from "./components/pages/Employees.js";
import Suppliers from "./components/pages/Suppliers.js";

export default function Routes({ appProps }) {
  return (
    <Switch>
      <Redirect exact from="/" to="/Inventory" />
      <AppliedRoute
        path="/Inventory"
        exact
        component={Inventory}
        appProps={appProps}
      />
      <AppliedRoute
        path="/Transaction"
        exact
        component={Transaction}
        appProps={appProps}
      />
      <AppliedRoute
        path="/TransactionDetails"
        exact
        component={TransactionDetails}
        appProps={appProps}
      />
      <AppliedRoute
        path="/Employees"
        exact
        component={Employees}
        appProps={appProps}
      />
      <AppliedRoute
        path="/Suppliers"
        exact
        component={Suppliers}
        appProps={appProps}
      />
      {/* <AppliedRoute exact component={ErrorPage} /> */}
    </Switch>
  );
}
