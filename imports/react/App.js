import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Tasks } from '../api/tasks.js';
import Task from './Task.js';

/**
 * Represents the whole app
 */
class App extends Component {
  handleSubmit = (event) => {
    event.preventDefault();

    // Get input value
    const inputText = event.target[0];
    const text = inputText.value.trim();
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
    });

    // Clear old value
    inputText.value = '';
  };

  handleSubmitUsingRefs = (event) => {
    event.preventDefault();

    // Find the text field via the React ref
    const textInput = ReactDOM.findDOMNode(this.refs.textInput);
    const text = textInput.value.trim();

    Tasks.insert({
      text,
      createdAt: new Date(), // current time
    });

    // Clear form
    textInput.value = '';
  };

  getTasks() {
    return [{ _id: 1, text: 'This is task 1' }, { _id: 2, text: 'This is task 2' }, { _id: 3, text: 'This is task 3' }];
  }

  renderTasks() {
    return this.props.tasks.map((task) => <Task key={task._id} task={task} />);
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>
          <form className="new-task" onSubmit={this.handleSubmit}>
            <input type="text" ref="textInput" placeholder="Type to add new tasks" />
          </form>
        </header>

        <ul>{this.renderTasks()}</ul>
      </div>
    );
  }
}

const AppWithTracker = withTracker(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
})(App);

export default AppWithTracker;
