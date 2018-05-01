import React, { Component } from "react";
import { format } from "date-fns";
import fb from "../../config/firebase";
import { withRouter } from "react-router-dom";
import ReactQuill from "react-quill";

class EditForm extends Component {
  state = {
    date: "1991-08-11",
    text: "",
    title: "",
    type: "On Demand"
  };

  componentDidMount() {
    console.log("mounted");
    fb
      .firestore()
      .collection("changelog")
      .doc(this.props.match.params.id)
      .get()
      .then(qs => {
        console.log(qs.data().editorState);
        this.setState({
          title: qs.data().title,
          text: qs.data().body,
          date: qs.data().date,
          type: qs.data().type
          /*editorState: JSON.parse(qs.data().editorState)*/
        });
        console.log(this.state);
      });
    //fb.firestore().collection("changelog").doc()
  }

  handleChange = value => {
    console.log(value);
    this.setState({ text: value });
  };

  save = e => {
    e.preventDefault();
    const objectToSend = {
      title: this.state.title,
      type: this.state.type,
      body: this.state.text,
      date: this.state.date
    };
    fb
      .firestore()
      .collection("changelog")
      .doc(this.props.match.params.id)
      .set(objectToSend)
      .then(res => {
        console.log("Saved entry to database");
        this.props.history.push("/admin");
      });
  };

  onChange = event => {
    console.log("onChange handler");
    let value = event.target.value;
    console.log(value);
    if (event.target.name === "date") {
      value = format(value, "YYYY-MM-DD");
    }
    this.setState({
      [event.target.name]: value
    });
  };

  render() {
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
                value={this.state.title}
              />
              <input
                onChange={this.onChange}
                type="date"
                name="date"
                value={this.state.date}
              />
              <select
                name="type"
                onChange={this.onChange}
                value={this.state.type}
              >
                <option>On demand</option>
                <option>MyWexer</option>
              </select>
              <ReactQuill
                value={this.state.text}
                onChange={this.handleChange}
                modules={modules}
                formats={formats}
              />
              <button>Save changelog</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EditForm);
