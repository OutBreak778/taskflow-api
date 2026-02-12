import API from './api';

class TaskService {
    // Get all tasks
    async getTasks(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `/task?${queryParams}` : '/task';
            
            const response = await API.get(url);
            return {
                success: true,
                tasks: response.data.data,
                count: response.data.count
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch tasks'
            };
        }
    }

    // Get single task
    async getTask(id: string) {
        try {
            const response = await API.get(`/task/${id}`);
            return {
                success: true,
                task: response.data.data
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch task'
            };
        }
    }

    // Create task
    async createTask(taskData: any) {
        try {
            const response = await API.post('/task', taskData);
            return {
                success: true,
                task: response.data.data
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create task'
            };
        }
    }

    // Update task
    async updateTask(id: any, taskData: any) {
        try {
            const response = await API.put(`/task/${id}`, taskData);
            return {
                success: true,
                task: response.data.data
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update task'
            };
        }
    }

    // Delete task
    async deleteTask(id: string) {
        try {
            await API.delete(`/task/${id}`);
            return {
                success: true
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to delete task'
            };
        }
    }

    // Get task statistics
    async getTaskStats() {
        try {
            const response = await API.get('/task/stats/summary');
            return {
                success: true,
                stats: response.data.data
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch stats'
            };
        }
    }
}

export default new TaskService();