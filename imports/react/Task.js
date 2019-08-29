import { Meteor } from 'meteor/meteor';

import React, { Component } from 'react';
import clsx from 'clsx';

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

  togglePrivate = (event) => {
    const { task } = this.props;
    // console.log('deleteTask()', task);
    Meteor.call('tasks.setPrivate', task._id, !task.private);
  };

  render() {
    const { task, showPrivateButton } = this.props;
    const userName = task.username ? task.username : null;

    // Give tasks a different className when they are checked off, so that we can style them nicely in CSS
    const taskClassName = clsx({
      checked: task.checked,
      private: task.private,
    });

    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteTask}>
          &times;
        </button>
        <input type="checkbox" readOnly checked={!!task.checked} onClick={this.toggleTask} />

        {showPrivateButton && (
          <button className="toggle-private" onClick={this.togglePrivate}>
            {task.private ? 'Private' : 'Public'}
          </button>
        )}

        <span className="text">
          {userName && <strong>{userName}: </strong>}
          {task.text}
        </span>
      </li>
    );
  }
}

export default Task;
