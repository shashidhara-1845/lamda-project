import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [tasksByTag, setTasksByTag] = useState({});
  
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskTag, setTaskTag] = useState(1);
  const [taskDate, setTaskDate] = useState(''); // New Date State
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null); 
  const [editingTask, setEditingTask] = useState(null); 
  
  const [editDesc, setEditDesc] = useState('');
  const [editStatus, setEditStatus] = useState(false);
  const [editDate, setEditDate] = useState(''); // New Edit Date State

  const categories = [
    { id: 1, name: 'Personal', accent: 'blue' },
    { id: 2, name: 'Education', accent: 'purple' },
    { id: 3, name: 'Finance', accent: 'green' },
    { id: 4, name: 'Health', accent: 'rose' }
  ];

  // Helper to get today's date in YYYY-MM-DD
  const getToday = () => new Date().toISOString().split('T')[0];

  const fetchTasks = async (search = '') => {
    try {
      const url = search ? `${API_URL}/task/${encodeURIComponent(search)}` : `${API_URL}/task`;
      const response = await fetch(url);
      const data = await response.json();
      setTasks(data);
    } catch (error) { console.error(error); }
  };

  const fetchTasksByTag = async (tagId) => {
    try {
      const response = await fetch(`${API_URL}/task/tag/${tagId}`);
      const data = await response.json();
      setTasksByTag(prev => ({ ...prev, [tagId]: data }));
    } catch (error) { console.error(error); }
  };

  const refreshAllTags = () => {
    categories.forEach(cat => fetchTasksByTag(cat.id));
  };

  useEffect(() => { refreshAllTags(); }, []);

  useEffect(() => {
    if (searchQuery) {
      const debounceTimer = setTimeout(() => { fetchTasks(searchQuery); }, 400);
      return () => clearTimeout(debounceTimer);
    } else {
      setTasks([]);
    }
  }, [searchQuery]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const newTask = { 
      task: taskName, 
      description: taskDesc, 
      tag: parseInt(taskTag), 
      status: false,
      due_date: taskDate || null
    };
    try {
      const response = await fetch(`${API_URL}/task`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTask)
      });
      if (response.ok) {
        setTaskName(''); setTaskDesc(''); setTaskDate('');
        fetchTasksByTag(parseInt(taskTag));
      }
    } catch (error) { console.error(error); }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditDesc(task.description || '');
    setEditStatus(task.status);
    setEditDate(task.due_date || '');
  };

  const handleSaveEdit = async () => {
    const updatedTask = { ...editingTask, description: editDesc, status: editStatus, due_date: editDate || null };
    try {
      const response = await fetch(`${API_URL}/task/${editingTask.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedTask)
      });
      if (response.ok) {
        setEditingTask(null);
        fetchTasksByTag(updatedTask.tag);
        if (searchQuery) fetchTasks(searchQuery);
      }
    } catch (error) { console.error(error); }
  };

  const handleDeleteTask = async (id) => {
    const tagId = editingTask.tag;
    try {
      await fetch(`${API_URL}/task/${id}`, { method: 'DELETE' });
      setEditingTask(null);
      fetchTasksByTag(tagId);
      if (searchQuery) fetchTasks(searchQuery);
    } catch (error) { console.error(error); }
  };

  return (
    <div className="app-container">
      
      <div className="top-half">
        <div className="glass-panel main-dashboard fade-in">
          <div className="dashboard-header">
            <h1>Task Hub</h1>
            <input type="text" className="search-bar cool-input" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <form onSubmit={handleAddTask} className="add-task-form">
            <input type="text" className="cool-input" placeholder="What needs to be done?" value={taskName} onChange={(e) => setTaskName(e.target.value)} required />
            <input type="date" className="cool-input date-input" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} />
            <select className="cool-input" value={taskTag} onChange={(e) => setTaskTag(e.target.value)}>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <button type="submit" className="glow-btn">Add Task</button>
          </form>
        </div>
      </div>

      <div className="bottom-half">
        <div className="category-grid">
          {categories.map((category, index) => {
            
            // Sort by Date (Earliest first). Tasks with no date go to the bottom.
            const sourceList = searchQuery
              ? tasks.filter(t => t.tag === category.id)
              : (tasksByTag[category.id] || []);

            const categoryTasks = sourceList
              .slice()
              .sort((a, b) => {
                const dateA = a.due_date || '9999-12-31';
                const dateB = b.due_date || '9999-12-31';
                return dateA.localeCompare(dateB);
              });
            
            const isOpen = expandedCategory === category.id;
            const today = getToday();

            return (
              <div key={category.id} className={`glass-panel category-box accent-${category.accent} slide-up delay-${index}`} onClick={() => setExpandedCategory(isOpen ? null : category.id)}>
                <div className="category-header">
                  <h2>{category.name}</h2>
                  <span className={`toggle-icon ${isOpen ? 'open' : ''}`}>+</span>
                </div>
                
                <div className={`task-list-container ${isOpen ? 'expanded' : ''}`}>
                  <div className="task-list" onClick={(e) => e.stopPropagation()}>
                    {categoryTasks.length === 0 ? <p className="empty">All clear.</p> : null}
                    
                    {categoryTasks.map((task, tIndex) => {
                      // Determine Urgency Status
                      let urgencyClass = '';
                      if (!task.status && task.due_date) {
                        if (task.due_date < today) urgencyClass = 'overdue';
                        else if (task.due_date === today) urgencyClass = 'due-today';
                      }

                      return (
                        <div key={task.id} className={`simple-task fade-in delay-${tIndex % 3} ${task.status ? 'done' : ''} ${urgencyClass}`}>
                          <div className="task-text">
                            <span className="status-indicator"></span>
                            <div className="task-info-stack">
                              <strong>{task.task}</strong>
                              {task.due_date && <span className="date-badge">{task.due_date}</span>}
                            </div>
                          </div>
                          <button className="edit-btn" onClick={() => openEditModal(task)}>Edit</button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editingTask && (
        <div className="modal-overlay fade-in">
          <div className="glass-panel modal-content pop-in">
            <h2>Edit Task</h2>
            
            <label>Due Date</label>
            <input type="date" className="cool-input" value={editDate} onChange={(e) => setEditDate(e.target.value)} />

            <label>Description</label>
            <textarea className="cool-input" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows="3" />

            <label className="checkbox-label">
              <input type="checkbox" checked={editStatus} onChange={(e) => setEditStatus(e.target.checked)} />
              <span className="custom-checkbox"></span>
              Mark as Completed
            </label>

            <div className="modal-actions">
              <button className="save-btn glow-btn" onClick={handleSaveEdit}>Save</button>
              <button className="delete-btn outline-btn" onClick={() => handleDeleteTask(editingTask.id)}>Delete</button>
              <button className="cancel-btn text-btn" onClick={() => setEditingTask(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;