import React, { useState, useEffect } from 'react';
import './App.css';
import TextInput from './Textinput/textinput';

const TreeNode = ({ node, onAddChild, onDeleteNode, onToggleComplete }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');

  useEffect(() => {
  }, [node.id, expanded, isAdding]);

  const handleAddClick = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    if (!expanded) {
      setExpanded(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (newNodeName.trim()) {
        onAddChild(node.id, newNodeName);
        setNewNodeName('');
        setIsAdding(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (newNodeName.trim()) {
      onAddChild(node.id, newNodeName);
      setNewNodeName('');
      setIsAdding(false);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDeleteNode(node.id);
  };

  const handleToggleComplete = (e) => {
    e.stopPropagation();
    onToggleComplete(node.id);
  };

  return (
    <div className="todo-item">
      <div className="flex items-center todo-row">
        <input 
          type="checkbox" 
          className="todo-checkbox" 
          checked={node.completed || false}
          onChange={handleToggleComplete}
        />
        <div 
          className="cursor-pointer text-lg flex-grow todo-text"
          onClick={() => setExpanded(!expanded)}
        >
          {node.children?.length > 0 && (
            <span className="expand-icon">{expanded ? "▼" : "▶"}</span>
          )}
          {node.name}
        </div>
        <div className="todo-actions">
          <button 
            onClick={handleAddClick} 
            className="add-button"
          >
            +
          </button>
          <button 
            onClick={handleDelete}
            className="delete-button"
          >
            ×
          </button>
        </div>
      </div>
      
      {isAdding && (
        <div className="mt-2 ml-4">
          <form onSubmit={handleSubmit} className="flex items-center">
            <TextInput
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              onKeyDown={handleKeyDown}
              label="Add a new task"
              color="#9D9D9D"
              autoFocus
            />
            <button 
              type="submit" 
              className="submit-button ml-2"
            >
              Добавить
            </button>
          </form>
        </div>
      )}

      {expanded && node.children?.length > 0 && (
        <div className="subtasks">
          {node.children.map((child) => (
            <TreeNode 
              key={child.id} 
              node={child} 
              onAddChild={onAddChild}
              onDeleteNode={onDeleteNode}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeView = ({ data, onAddNode, onDeleteNode, onToggleComplete }) => {
  const [newTodoName, setNewTodoName] = useState('');

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodoName.trim()) {
      onAddNode(null, newTodoName);
      setNewTodoName('');
    }
  };

  useEffect(() => {
  }, [data]);

  return (
    <div className="todo-container">
      <h1 className="todo-title">Todo List</h1>
      <form onSubmit={handleAddTodo} className="todo-add-form">
        <TextInput
          value={newTodoName}
          onChange={(e) => setNewTodoName(e.target.value)}
          label="Add a new task"
          color="#9D9D9D"
        />
        <button type="submit" className="add-task-button">Add</button>
      </form>
      <div className="todo-list">
        {data.map((node) => (
          <TreeNode 
            key={node.id} 
            node={node} 
            onAddChild={onAddNode}
            onDeleteNode={onDeleteNode}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
    </div>
  );
};

const initialTreeData = [];

export default function App() {
  const [treeData, setTreeData] = useState(() => {
    const savedData = localStorage.getItem('todoListData');
    return savedData ? JSON.parse(savedData) : initialTreeData;
  });

  useEffect(() => {
    localStorage.setItem('todoListData', JSON.stringify(treeData));
  }, [treeData]);

  const addNode = (parentId, newNodeName) => {
    const newId = Date.now();
    
    if (parentId === null) {
      setTreeData([...treeData, { id: newId, name: newNodeName, children: [], completed: false }]);
      return;
    }
    
    const updateNode = (nodes) => {
      return nodes.map(node => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), { id: newId, name: newNodeName, children: [], completed: false }]
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateNode(node.children)
          };
        }
        return node;
      });
    };

    setTreeData(updateNode(treeData));
  };

  const toggleComplete = (nodeId) => {
    const updateNode = (nodes) => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            completed: !node.completed
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateNode(node.children)
          };
        }
        return node;
      });
    };

    setTreeData(updateNode(treeData));
  };

  const deleteNode = (nodeId) => {
    const filterNodes = (nodes) => {
      return nodes.filter(node => {
        if (node.id === nodeId) {
          return false;
        }
        if (node.children) {
          node.children = filterNodes(node.children);
        }
        return true;
      });
    };

    setTreeData(filterNodes(treeData));
  };

  return <TreeView 
    data={treeData} 
    onAddNode={addNode} 
    onDeleteNode={deleteNode} 
    onToggleComplete={toggleComplete}
  />;
}