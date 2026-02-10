import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import api from '../utils/api.js';
import { FiCode, FiTool, FiFileText, FiPlus, FiSearch, FiEdit2, FiTrash2, FiList, FiGrid, FiActivity, FiClock } from 'react-icons/fi';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
  });

  const statsRef = useRef([]);
  const tasksRef = useRef([]);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery]);

  useEffect(() => {
    if (statsRef.current.length > 0) {
      gsap.fromTo(
        statsRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }
  }, [tasks]);

  useEffect(() => {
    if (tasksRef.current.length > 0) {
      gsap.fromTo(
        tasksRef.current,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    }
  }, [filteredTasks]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!taskForm.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      await api.post('/tasks', taskForm);
      toast.success('Task created successfully');
      setIsCreateDialogOpen(false);
      setTaskForm({ title: '', description: '', status: 'pending', priority: 'medium' });
      loadTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    if (!taskForm.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      await api.put(`/tasks/${selectedTask.id}`, taskForm);
      toast.success('Task updated successfully');
      setIsEditDialogOpen(false);
      setSelectedTask(null);
      setTaskForm({ title: '', description: '', status: 'pending', priority: 'medium' });
      loadTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted successfully');
      loadTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  const openEditDialog = (task) => {
    setSelectedTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
    });
    setIsEditDialogOpen(true);
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
  };

  const CircularProgress = ({ value, total, color, label, subtitle, metric }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-start">
        <div className="relative w-24 h-24 mb-3">
          <svg className="transform -rotate-90 w-24 h-24">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={color}
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{value}</span>
          </div>
        </div>
        <div>
          <p className="text-base font-bold text-gray-800 mb-0.5">{label}</p>
          <p className="text-xs text-gray-500 mb-1">{subtitle}</p>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{metric}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2" data-testid="dashboard-heading">Project Workspace</h2>
          <p className="text-sm text-gray-500 italic">"Building the future of efficiency, one task at a time."</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#5f7a7a] hover:bg-[#4d6262] text-white rounded-lg font-medium transition-colors" data-testid="create-task-button">
              <FiPlus className="h-4 w-4" />
              Create New Task
            </button>
          </DialogTrigger>
          <DialogContent data-testid="create-task-dialog" className="bg-white">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Enter task title"
                  data-testid="task-title-input"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Enter task description"
                  data-testid="task-description-input"
                  className="h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={taskForm.status}
                    onValueChange={(value) => setTaskForm({ ...taskForm, status: value })}
                  >
                    <SelectTrigger data-testid="task-status-select" className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={taskForm.priority}
                    onValueChange={(value) => setTaskForm({ ...taskForm, priority: value })}
                  >
                    <SelectTrigger data-testid="task-priority-select" className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#5f7a7a] hover:bg-[#4d6262]" data-testid="create-task-submit">
                Create Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div
          ref={(el) => (statsRef.current[0] = el)}
          className="bg-white rounded-2xl p-6 border border-gray-200"
          whileHover={{ y: -2 }}
        >
          <CircularProgress
            value={stats.total}
            total={stats.total}
            color="#5f7a7a"
            label="Total Tasks"
            subtitle="Backlog Items"
            metric="SCALE: HIGH"
          />
        </motion.div>

        <motion.div
          ref={(el) => (statsRef.current[1] = el)}
          className="bg-white rounded-2xl p-6 border border-gray-200"
          whileHover={{ y: -2 }}
        >
          <CircularProgress
            value={stats.inProgress}
            total={stats.total}
            color="#d4a574"
            label="In Progress"
            subtitle="Ongoing Sprints"
            metric="50% VELOCITY"
          />
        </motion.div>

        <motion.div
          ref={(el) => (statsRef.current[2] = el)}
          className="bg-white rounded-2xl p-6 border border-gray-200"
          whileHover={{ y: -2 }}
        >
          <CircularProgress
            value={stats.completed}
            total={stats.total}
            color="#6b9b7f"
            label="Completed"
            subtitle="Shipped Features"
            metric="75% ACCURACY"
          />
        </motion.div>
      </div>

      {/* Task List Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Task List</h3>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <FiList className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <FiGrid className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks by title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-white border-gray-300"
            data-testid="search-input"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40 h-10 bg-white">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          Filter
        </button>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-16" data-testid="loading-state">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#5f7a7a] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      ) : (
        <div className="space-y-4" data-testid="tasks-list">
          {filteredTasks.map((task, index) => {
            const getIcon = () => {
              if (index % 3 === 0) return FiCode;
              if (index % 3 === 1) return FiTool;
              return FiFileText;
            };

            const Icon = getIcon();
            const iconBg = index % 3 === 0 ? 'bg-orange-50' : index % 3 === 1 ? 'bg-teal-50' : 'bg-gray-100';
            const iconColor = index % 3 === 0 ? 'text-orange-600' : index % 3 === 1 ? 'text-teal-600' : 'text-gray-600';

            return (
              <motion.div
                key={task.id}
                ref={(el) => (tasksRef.current[index] = el)}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-300 transition-colors"
                data-testid={`task-item-${task.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-base font-bold text-gray-900" data-testid="task-title">
                        {task.title}
                      </h3>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded ${task.priority === 'high' ? 'bg-red-50 text-red-600' :
                          task.priority === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-blue-50 text-blue-600'
                        }`} data-testid="task-priority">
                        {task.priority.toUpperCase()}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-sm text-gray-600 mb-3" data-testid="task-description">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded font-medium">
                        {task.status === 'completed' ? 'Frontend' : task.status === 'in-progress' ? 'State' : 'Testing'}
                      </span>
                      <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded font-medium">
                        {task.status === 'completed' ? 'Auth' : task.status === 'in-progress' ? 'Refactor' : 'Quality'}
                      </span>
                      <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded font-medium">
                        {task.status === 'completed' ? 'v1.2.0' : task.status === 'in-progress' ? 'Optimization' : 'CI/CD'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditDialog(task)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      data-testid="edit-task-button"
                    >
                      <FiEdit2 className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      data-testid="delete-task-button"
                    >
                      <FiTrash2 className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Add Another Task Entry */}
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 bg-[#5f7a7a] rounded-lg flex items-center justify-center">
              <FiPlus className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">Add Another Task Entry</span>
          </button>
        </div>
      )}

      {/* System Status */}
      <div className="mt-8 bg-[#5f7a7a] rounded-2xl p-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <FiActivity className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">System Status</h3>
            <p className="text-sm text-white/80">Environment: Production. All systems operational. 98.4% Uptime.</p>
            <div className="flex items-center gap-1 mt-3">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-8 rounded-sm ${i < 8 ? 'bg-green-400' : 'bg-white/30'
                    }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <button className="px-6 py-2.5 bg-white rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors flex items-center gap-2">
          <FiClock className="h-4 w-4" />
          Log Activity
        </button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent data-testid="edit-task-dialog" className="bg-white">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateTask} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editTitle">Title *</Label>
              <Input
                id="editTitle"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="Enter task title"
                data-testid="edit-task-title-input"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Input
                id="editDescription"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Enter task description"
                data-testid="edit-task-description-input"
                className="h-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select
                  value={taskForm.status}
                  onValueChange={(value) => setTaskForm({ ...taskForm, status: value })}
                >
                  <SelectTrigger data-testid="edit-task-status-select" className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPriority">Priority</Label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(value) => setTaskForm({ ...taskForm, priority: value })}
                >
                  <SelectTrigger data-testid="edit-task-priority-select" className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#5f7a7a] hover:bg-[#4d6262]" data-testid="edit-task-submit">
              Update Task
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;