import React, { Component } from "react";
import { format } from "date-fns";
import "./NewForm.css";
import fb from "../../config/firebase";
import ReactQuill from "react-quill";
import { withRouter } from "react-router-dom";
import { RingLoader } from "react-spinners";

class NewForm extends Component {
  state = {
    date: format(new Date(), "YYYY-MM-DD"),
    title: "",
    type: "On Demand",
    text: "",
    loading: false
  };

  save = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });
    const objectToSend = {
      title: this.state.title,
      type: this.state.type,
      body: this.state.text,
      date: this.state.date
    };
    fb
      .firestore()
      .collection("changelog")
      .add(objectToSend)
      .then(res => {
        console.log("Saved entry to database");
        this.props.history.push("/admin");
      });
  };

  onChange = event => {
    console.log("onChange handler");
    let value = event.target.value;
    console.log(value);
    this.setState({
      [event.target.name]: value
    });
  };

  handleChange = value => {
    console.log(value);
    this.setState({ text: value });
  };

  render() {
    const { date } = this.state;

    const modules = {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" }
        ],
        ["link", "image"],
        ["clean"]
      ]
    };

    const formats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image"
    ];

    return (
      <div>
        <div className="grid">
          <form onSubmit={this.save}>
            <div className="form-flex">
              <input
                type="text"
                name="title"
                onChange={this.onChange}
                placeholder="Title"
              />
              <input
                onChange={this.onChange}
                type="date"
                name="date"
                value={date}
              />
              <select name="type" onChange={this.onChange}>
                <option>On demand</option>
                <option>MyWexer</option>
              </select>
              <ReactQuill
                value={this.state.text}
                onChange={this.handleChange}
                modules={modules}
                formats={formats}
              />
              <button>Add changelog</button>
              <RingLoader color={"#123abc"} loading={this.state.loading} />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(NewForm);
