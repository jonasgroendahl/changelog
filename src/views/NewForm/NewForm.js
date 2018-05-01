import React, { Component } from "react";
import { format } from "date-fns";
import "./NewForm.css";
import { EditorState, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import fb from "../../config/firebase";

export default class NewForm extends Component {
  state = {
    date: "1991-08-21",
    editorState: EditorState.createEmpty(),
    contentState: null,
    title: "",
    type: "On Demand"
  };

  onEditorStateChange = editorState => {
    console.log(editorState);
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
      date: this.state.date,
      editorState: JSON.stringify(this.state.editorState)
    };
    fb
      .firestore()
      .collection("changelog")
      .add(objectToSend)
      .then(res => {
        console.log("Saved entry to database");
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

  render() {
    const { date, editorState } = this.state;

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
                value={format(new Date(), "YYYY-MM-DD")}
              />
              <select name="type" onChange={this.onChange}>
                <option>On demand</option>
                <option>MyWexer</option>
              </select>
              <Editor
                editorState={editorState}
                onEditorStateChange={this.onEditorStateChange}
                onContentStateChange={this.onContentStateChange}
              />
              <button>Add changelog</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
