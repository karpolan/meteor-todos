import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Tasks } from '../api/tasks.js';
import Task from './Task.js';
import AccountsUiWrapper from './AccountsUiWrapper.js';

/**
 * Represents the whole app
 */
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

  addTask(text) {
    Meteor.call('tasks.insert', text);
    // Tasks.insert({
    //   text,
    //   createdAt: new Date(), // current time
    //   owner: Meteor.userId(), // _id of logged in user
    //   username: Meteor.user().username, // username of logged in user
    // });
  }

  toggleHideCompleted = (event) => {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // Get input value
    const inputText = event.target[0];
    const text = inputText.value.trim();
    this.addTask(text);
    // Clear old value
    inputText.value = '';
  };

  handleSubmitUsingRefs = (event) => {
    event.preventDefault();
    // Find the text field via the React ref
    const textInput = ReactDOM.findDOMNode(this.refs.textInput);
    const text = textInput.value.trim();
    this.addTask(text);
    // Clear form
    textInput.value = '';
  };

  getTasks() {
    return [{ _id: 1, text: 'This is task 1' }, { _id: 2, text: 'This is task 2' }, { _id: 3, text: 'This is task 3' }];
  }

  /**
   * Filters and renders list of given task.
   * @param {array} tasks - list of task to filter and render.
   * @param {bool} hideCompleted - flag to not show the complete tasks.
   */
  renderTasks(tasks, hideCompleted, currentUser) {
    let filteredTasks = [];
    if (hideCompleted) {
      filteredTasks = tasks.filter((task) => !task.checked);
    } else {
      filteredTasks = tasks;
    }

    return filteredTasks.map((task) => {
      const currentUserId = currentUser && currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
      return <Task key={task._id} task={task} showPrivateButton={showPrivateButton} />;
    });
  }

  render() {
    const { tasks, incompleteCount, currentUser } = this.props;
    const { hideCompleted } = this.state;

    return (
      <div className="container">
        <header>
          <h1>Todo List ({incompleteCount})</h1>

          <label className="hide-completed">
            <input type="checkbox" readOnly checked={hideCompleted} onClick={this.toggleHideCompleted} />
            Hide Completed Tasks
          </label>

          <AccountsUiWrapper />

          {currentUser ? (
            <form className="new-task" onSubmit={this.handleSubmit}>
              <input type="text" ref="textInput" placeholder="Type to add new tasks" />
            </form>
          ) : null}
        </header>

        <ul>{this.renderTasks(tasks, hideCompleted, currentUser)}</ul>
      </div>
    );
  }
}

const AppWithTracker = withTracker(() => {
  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
})(App);

export default AppWithTracker;
