import React, { Component } from "react";
import "./Main.css";
import fb from "../../config/firebase";
import draftToHtml from "draftjs-to-html";

export default class Main extends Component {
  state = {
    items: []
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
        <li>
          <h1>Changelog</h1>
          <p>{i.type}</p>
          <a href={"#" + i.id} key={"nav" + i.id}>
            {i.date}
          </a>
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
              __html: draftToHtml(JSON.parse(i.body))
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
          <div className="main-grid-content">{postsMain}</div>
        </div>
      </div>
    );
  }
}
