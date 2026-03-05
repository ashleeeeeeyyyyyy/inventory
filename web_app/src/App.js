import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReactLoading from "react-loading";
import Routes from "./Routes";
import Sidebar from "./components/Sidebar.js";
import Topbar from "./components/Topbar.js";
import axios from "axios";

export default class App extends Component {
  state = {
    components: {
      swal: withReactContent(Swal),
    },
    loading: true,
    logged_in: false,
  };

  axiosCreate() {
    let axiosReq = axios.create({
      baseURL: "http://localhost:8082/",
    });
    return axiosReq;
  }

  // componentDidMount() {
  //   this.setState({ loading: false });
  // }

  // axiosCreate health check (disabled for local dev)
  componentDidMount() {
    this.axiosCreate()
      .get("health")
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(() => {
        this.state.components.swal
          .fire(
            "API Error!",
            "Check your API's connection or click OK to reload",
            "error",
          )
          .then(() => {
            window.location.reload(false);
          });
      });
  }

  handleLogin = (event) => {
    this.setState({ logged_in: true });
    console.log(this.props);
    event.preventDefault();
  };

  render() {
    const url = "http://localhost:8082/";
    const tools = this.state.components;

    return (
      <div id="wrapper">
        {this.state.loading === true && (
          <div
            style={{
              display: "flex",
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              zIndex: "1000",
              background: "#fff",
            }}
          >
            <div id="content-loading">
              <ReactLoading type={"spin"} color="rgb(48, 133, 214)" />
              <span>Loading ...</span>
            </div>
          </div>
        )}
        <Sidebar></Sidebar>
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Topbar></Topbar>
            <div className="container-fluid">
              <Router>
                <Routes appProps={{ url, tools }} />
              </Router>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
