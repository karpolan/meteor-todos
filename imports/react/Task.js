import { Meteor } from 'meteor/meteor';

import React, { Component } from 'react';

import { Tasks } from '../api/tasks.js';

/**
 * Represents a single todo item
 */
class Task extends Component {
  toggleTask = (event) => {
    const { task } = this.props;
    // console.log('toggleTask()', task);
    Meteor.call('tasks.setChecked', task._id, !task.checked);

    // Tasks.update(task._id, {
    //   $set: { checked: !task.checked },
    // });
  };

  deleteTask = (event) => {
    const { task } = this.props;
    // console.log('deleteTask()', task);
    Meteor.call('tasks.remove', task._id);

    // Tasks.remove(task._id);
  };

  render() {
    const { task } = this.props;
    const userName = task.username ? task.username : null;

    // Give tasks a different className when they are checked off, so that we can style them nicely in CSS
    const taskClassName = task.checked ? 'checked' : '';

    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteTask}>
          &times;
        </button>
        <input type="checkbox" readOnly checked={!!task.checked} onClick={this.toggleTask} />
        <span className="text">
          {userName && <strong>{userName}: </strong>}
          {task.text}
        </span>
      </li>
    );
  }
}

export default Task;
