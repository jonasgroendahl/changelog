import React from "react";
import { Switch, Route } from "react-router-dom";
import NewForm from "../views/NewForm/NewForm";
import Main from "../views/Main/Main";
import Admin from "../views/Admin/Admin";
import Post from "../views/EditForm/EditForm";

const Router = () => {
  return (
    <Switch>
      <Route path="/" exact component={Main} />
      <Route path="/admin" exact component={Admin} />
      <Route path="/post/:id" component={Post} />
      <Route path="/new" exact component={NewForm} />
    </Switch>
  );
};

export default Router;
