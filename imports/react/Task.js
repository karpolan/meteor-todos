import React, { Component } from 'react';

import { Tasks } from '../api/tasks.js';

/**
 * Represents a single todo item
 */
class Task extends Component {
  toggleTask = (event) => {
    const { task } = this.props;
    // console.log('toggleTask()', task);
    Tasks.update(task._id, {
      $set: { checked: !task.checked },
    });
  };

  deleteTask = (event) => {
    const { task } = this.props;
    // console.log('deleteTask()', task);
    Tasks.remove(task._id);
  };

  render() {
    const { task } = this.props;

    // Give tasks a different className when they are checked off, so that we can style them nicely in CSS
    const taskClassName = task.checked ? 'checked' : '';

    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteTask}>
          &times;
        </button>

        <input type="checkbox" readOnly checked={!!task.checked} onClick={this.toggleTask} />

        <span className="text">{task.text}</span>
      </li>
    );
  }
}

export default Task;
