import React, { Component } from "react";
import "./Main.css";
import fb from "../../config/firebase";
import { ClimbingBoxLoader } from "react-spinners";
import Icon from "@fortawesome/react-fontawesome";
import IconFolder from "@fortawesome/fontawesome-free-solid/faFolder";

export default class Main extends Component {
  state = {
    items: [],
    loading: true
  };

  getItems = () => {
    const items = [];
    fb
      .firestore()
      .collection("changelog")
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(i => {
          items.push({
            title: i.data().title,
            date: i.data().date,
            body: i.data().body,
            type: i.data().type,
            id: i.id,
            key: i.id
          });
        });
        this.setState({ items });
        setTimeout(() => {
          this.setState({ loading: false });
        }, 1000);
      });
  };

  componentDidMount() {
    this.getItems();
  }

  componentDidUpdate() {
    console.log("Updated");
  }

  render() {
    const postsSideNav = this.state.items.map(i => {
      return (
        <li key={"nav" + i.id}>
          <h1>Changelog</h1>
          <p>{i.type}</p>
          <a href={"#" + i.id}>{i.date}</a>
        </li>
      );
    });

    const postsMain = this.state.items.map(i => {
      return (
        <div className="article" id={i.id} key={"main" + i.id}>
          <h1>{i.title}</h1>
          <p>{i.date}</p>
          <div
            dangerouslySetInnerHTML={{
              __html: i.body
            }}
          />
        </div>
      );
    });

    return (
      <div>
        <div className="main-sidenav">
          <ul>{postsSideNav}</ul>
        </div>
        <div className="main-grid">
          <ClimbingBoxLoader color={"black"} loading={this.state.loading} />
          <div className="main-grid-content">
            {!this.state.loading ? (
              postsMain
            ) : (
              <div>
                <Icon
                  className="article"
                  icon={IconFolder}
                  style={{ width: 50, height: 50 }}
                />
                <Icon
                  className="article"
                  icon={IconFolder}
                  style={{ width: 50, height: 50 }}
                />
                <Icon
                  className="article"
                  icon={IconFolder}
                  style={{ width: 50, height: 50 }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
