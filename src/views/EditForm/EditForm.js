import React, { Component } from "react";
import { format } from "date-fns";
import { EditorState, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import fb from "../../config/firebase";
import { withRouter } from "react-router-dom";

class EditForm extends Component {
  state = {
    date: "1991-08-11",
    editorState: null,
    contentState: null,
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
          contentState: JSON.parse(qs.data().body),
          date: qs.data().date,
          type: qs.data().type
          /*editorState: JSON.parse(qs.data().editorState)*/
        });
        console.log(this.state);
      });
    //fb.firestore().collection("changelog").doc()
  }

  onEditorStateChange = editorState => {
    console.log("editStateChange", editorState);
    this.setState({
      editorState
    });
  };

  onContentStateChange = contentState => {
    console.log(contentState);
    this.setState({
      contentState
    });
  };

  save = e => {
    e.preventDefault();
    const objectToSend = {
      title: this.state.title,
      type: this.state.type,
      body: JSON.stringify(this.state.contentState),
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
              <Editor
                editorState={this.state.editorState}
                contentState={this.state.contentState}
                onEditorStateChange={this.onEditorStateChange}
                onContentStateChange={this.onContentStateChange}
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
