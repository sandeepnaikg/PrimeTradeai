import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiCheckCircle, FiClock, FiAlertCircle, FiBarChart2, FiPieChart, FiActivity, FiCalendar } from 'react-icons/fi';
import api from '../utils/api.js';

const Analytics = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        pending: tasks.filter(t => t.status === 'pending').length,
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length,
    };

    const completionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0;
    const inProgressRate = stats.total > 0 ? ((stats.inProgress / stats.total) * 100).toFixed(1) : 0;
    const pendingRate = stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : 0;

    const StatCard = ({ icon: Icon, label, value, subtitle, color, bgColor }) => (
        <motion.div
            className="bg-white rounded-2xl p-6 border border-gray-200"
            whileHover={{ y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                </div>
            </div>
            <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
                <p className="text-sm font-semibold text-gray-800 mb-1">{label}</p>
                <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
        </motion.div>
    );

    const ProgressBar = ({ label, value, total, color }) => {
        const percentage = total > 0 ? (value / total) * 100 : 0;

        return (
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">{label}</span>
                    <span className="text-sm font-bold text-gray-900">{value} / {total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                        className={`h-3 rounded-full ${color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total tasks</p>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
                <p className="text-sm text-gray-500 italic">"Data-driven insights for better productivity"</p>
            </div>

            {loading ? (
                <div className="text-center py-16">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-[#5f7a7a] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading analytics...</p>
                </div>
            ) : (
                <>
                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={FiBarChart2}
                            label="Total Tasks"
                            value={stats.total}
                            subtitle="All time tasks created"
                            color="text-[#5f7a7a]"
                            bgColor="bg-teal-50"
                        />
                        <StatCard
                            icon={FiCheckCircle}
                            label="Completed"
                            value={stats.completed}
                            subtitle={`${completionRate}% completion rate`}
                            color="text-green-600"
                            bgColor="bg-green-50"
                        />
                        <StatCard
                            icon={FiClock}
                            label="In Progress"
                            value={stats.inProgress}
                            subtitle={`${inProgressRate}% currently active`}
                            color="text-blue-600"
                            bgColor="bg-blue-50"
                        />
                        <StatCard
                            icon={FiAlertCircle}
                            label="Pending"
                            value={stats.pending}
                            subtitle={`${pendingRate}% awaiting start`}
                            color="text-yellow-600"
                            bgColor="bg-yellow-50"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Status Breakdown */}
                        <motion.div
                            className="bg-white rounded-2xl p-6 border border-gray-200"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                    <FiPieChart className="h-5 w-5 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Status Breakdown</h3>
                            </div>

                            <ProgressBar
                                label="Completed Tasks"
                                value={stats.completed}
                                total={stats.total}
                                color="bg-green-500"
                            />
                            <ProgressBar
                                label="In Progress Tasks"
                                value={stats.inProgress}
                                total={stats.total}
                                color="bg-blue-500"
                            />
                            <ProgressBar
                                label="Pending Tasks"
                                value={stats.pending}
                                total={stats.total}
                                color="bg-yellow-500"
                            />
                        </motion.div>

                        {/* Priority Distribution */}
                        <motion.div
                            className="bg-white rounded-2xl p-6 border border-gray-200"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                                    <FiTrendingUp className="h-5 w-5 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Priority Distribution</h3>
                            </div>

                            <ProgressBar
                                label="High Priority"
                                value={stats.high}
                                total={stats.total}
                                color="bg-red-500"
                            />
                            <ProgressBar
                                label="Medium Priority"
                                value={stats.medium}
                                total={stats.total}
                                color="bg-yellow-500"
                            />
                            <ProgressBar
                                label="Low Priority"
                                value={stats.low}
                                total={stats.total}
                                color="bg-blue-500"
                            />
                        </motion.div>
                    </div>

                    {/* Performance Metrics */}
                    <motion.div
                        className="bg-gradient-to-br from-[#5f7a7a] to-[#4d6262] rounded-2xl p-8 text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <FiActivity className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold">Performance Metrics</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-white/80 text-sm mb-1">Productivity Score</p>
                                <p className="text-4xl font-bold">{completionRate}%</p>
                                <p className="text-white/60 text-xs mt-1">Based on completion rate</p>
                            </div>
                            <div>
                                <p className="text-white/80 text-sm mb-1">Active Workload</p>
                                <p className="text-4xl font-bold">{stats.inProgress + stats.pending}</p>
                                <p className="text-white/60 text-xs mt-1">Tasks in pipeline</p>
                            </div>
                            <div>
                                <p className="text-white/80 text-sm mb-1">Success Rate</p>
                                <p className="text-4xl font-bold">{stats.total > 0 ? ((stats.completed / (stats.completed + stats.inProgress + stats.pending)) * 100).toFixed(0) : 0}%</p>
                                <p className="text-white/60 text-xs mt-1">Tasks completed vs total</p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
};

export default Analytics;
