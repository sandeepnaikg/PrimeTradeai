import { motion } from 'framer-motion';
import { FiBook, FiCode, FiZap, FiShield, FiGitBranch, FiPackage, FiServer, FiDatabase } from 'react-icons/fi';

const Documentation = () => {
    const DocSection = ({ icon: Icon, title, description, items }) => (
        <motion.div
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
        >
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-[#5f7a7a]" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                </div>
            </div>

            {items && (
                <ul className="space-y-2 ml-16">
                    {items.map((item, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-[#5f7a7a] mt-1">•</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            )}
        </motion.div>
    );

    const CodeBlock = ({ title, code }) => (
        <div className="bg-gray-900 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-400 mb-2">{title}</p>
            <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Documentation</h2>
                <p className="text-sm text-gray-500 italic">"Everything you need to know about TaskFlow"</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <motion.div
                    className="bg-gradient-to-br from-[#5f7a7a] to-[#4d6262] rounded-2xl p-6 text-white"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <FiBook className="h-8 w-8 mb-3" />
                    <h3 className="text-xl font-bold mb-2">Getting Started</h3>
                    <p className="text-white/80 text-sm">Quick start guide to begin using TaskFlow effectively</p>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <FiCode className="h-8 w-8 mb-3" />
                    <h3 className="text-xl font-bold mb-2">API Reference</h3>
                    <p className="text-white/80 text-sm">Complete API documentation for developers</p>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <FiZap className="h-8 w-8 mb-3" />
                    <h3 className="text-xl font-bold mb-2">Best Practices</h3>
                    <p className="text-white/80 text-sm">Tips and tricks for maximum productivity</p>
                </motion.div>
            </div>

            <DocSection
                icon={FiPackage}
                title="Project Overview"
                description="TaskFlow is a modern task management application built with React and FastAPI. It provides a clean, intuitive interface for managing your daily tasks with features like priority levels, status tracking, and analytics."
                items={[
                    "Frontend: React 18 with Vite for fast development",
                    "Backend: FastAPI with Python for robust API",
                    "Database: PostgreSQL for reliable data storage",
                    "Authentication: JWT-based secure authentication",
                    "UI: Tailwind CSS with custom components",
                    "State Management: React hooks and context"
                ]}
            />

            <DocSection
                icon={FiGitBranch}
                title="Architecture"
                description="The application follows a modern client-server architecture with clear separation of concerns."
                items={[
                    "Frontend communicates with backend via RESTful API",
                    "JWT tokens stored in localStorage for authentication",
                    "React Router for client-side routing",
                    "Framer Motion for smooth animations",
                    "GSAP for advanced animation effects",
                    "Radix UI for accessible component primitives"
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <motion.div
                    className="bg-white rounded-2xl p-6 border border-gray-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <FiServer className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Backend Setup</h3>
                    </div>

                    <CodeBlock
                        title="Install dependencies"
                        code={`cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt`}
                    />

                    <CodeBlock
                        title="Run the server"
                        code={`uvicorn server:app --reload`}
                    />
                </motion.div>

                <motion.div
                    className="bg-white rounded-2xl p-6 border border-gray-200"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FiCode className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Frontend Setup</h3>
                    </div>

                    <CodeBlock
                        title="Install dependencies"
                        code={`cd frontend
npm install`}
                    />

                    <CodeBlock
                        title="Run the development server"
                        code={`npm start`}
                    />
                </motion.div>
            </div>

            <DocSection
                icon={FiDatabase}
                title="API Endpoints"
                description="Complete list of available API endpoints for task management and authentication."
                items={[
                    "POST /auth/register - Create a new user account",
                    "POST /auth/login - Authenticate and get access token",
                    "GET /auth/profile - Get current user profile",
                    "PUT /auth/profile - Update user profile",
                    "GET /tasks - Get all tasks for current user",
                    "POST /tasks - Create a new task",
                    "PUT /tasks/{id} - Update an existing task",
                    "DELETE /tasks/{id} - Delete a task"
                ]}
            />

            <DocSection
                icon={FiShield}
                title="Security"
                description="TaskFlow implements industry-standard security practices to protect your data."
                items={[
                    "JWT-based authentication with secure token storage",
                    "Password hashing using bcrypt algorithm",
                    "CORS protection for API endpoints",
                    "SQL injection prevention through ORM",
                    "XSS protection with proper input sanitization",
                    "HTTPS recommended for production deployment"
                ]}
            />

            <motion.div
                className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 text-white mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h3 className="text-2xl font-bold mb-3">Need Help?</h3>
                <p className="text-white/90 mb-4">
                    If you encounter any issues or have questions, please refer to the README.md file in the project root
                    or contact the development team.
                </p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span className="text-sm">Version 1.0.0</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span className="text-sm">Last Updated: 2026</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Documentation;
