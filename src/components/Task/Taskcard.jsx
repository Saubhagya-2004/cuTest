export default function Taskcard({ task }) {
    return (
        <div className="task-card">
            {task && task.title ? task.title : null}
        </div>
    )
}