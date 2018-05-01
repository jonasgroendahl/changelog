import React, { Component } from "react";
import { Link } from "react-router-dom";
import fb from "../../config/firebase";
import Icon from "@fortawesome/react-fontawesome";
import IconArrow from "@fortawesome/fontawesome-free-solid/faArrowRight";
import IconDelete from "@fortawesome/fontawesome-free-solid/faRecycle";
import "./Admin.css";

class Admin extends Component {
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
            id: i.id
          });
        });
        this.setState({ items });
      });
  };

  componentDidMount() {
    this.getItems();
  }

  onDelete = id => {
    console.log("Deleting " + id);
    fb
      .firestore()
      .collection("changelog")
      .doc(id)
      .delete()
      .then(i => {
        const { items } = this.state;
        const index = items.findIndex(i => {
          i.id == id;
        });
        items.splice(index, 1);
        this.setState({ items });
      });
  };

  render() {
    const items = this.state.items.map(i => {
      return (
        <li key={i.id}>
          {i.id}. {i.title}{" "}
          <Link to={"/post/" + i.id}>
            <Icon icon={IconArrow} />
          </Link>
          <Icon icon={IconDelete} onClick={() => this.onDelete(i.id)} />
        </li>
      );
    });

    return (
      <div className="admin-wrapper">
        <Link to="/new">Add new</Link>
        <h1>Posts:</h1>
        <ul>{items}</ul>
      </div>
    );
  }
}

export default Admin;
