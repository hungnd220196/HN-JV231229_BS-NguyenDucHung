import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

function TodoList() {
  const [tasks, setTasks] = useState(() => {
    const taskLocal = JSON.parse(localStorage.getItem("tasks")) || [];
    return taskLocal;
  });
  const [newTask, setNewTask] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState({ id: null, name: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [nameError, setNameError] = useState("");

  //dong modalEdit
  const handleCloseEdit = () => setShowEditModal(false);
  //Show edit
  const handleShowEdit = (task) => {
    setEditTask(task);
    setShowEditModal(true);
  };
  //dong modal delete
  const handleCloseDelete = () => setShowDeleteModal(false);
  //Show delete
  const handleShowDeleteConfirm = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };
  // Hàm validate dữ liệu đầu vào
  const validateData = (name, value) => {
    let valid = true;
    switch (name) {
      case "taskInput":
        if (!value) {
          setNameError("Tên không được để trống");
          valid = false;
        } else {
          setNameError("");
        }
        break;

      default:
        return valid;
    }

    return valid;
  };

  // ham add task
  const handleAddTask = () => {
    const nameValid = validateData("taskInput", newTask);
   if (nameValid){

     const task = {
       id: Math.ceil(Math.random() * 99999999),
       name: newTask,
       completed: false,
     };
  
     const newTasks = [...tasks, task];
     //púh cong viec vao trong mang
     setTasks(newTasks);
     //luu vao local
     localStorage.setItem("tasks", JSON.stringify(newTasks));
     //xoa gia tri trong input
     setNewTask("");
   }

  };

  const handleToggleTask = (id) => {
    //vi tri can cap nhat
    const findIndexTask = tasks.findIndex((task) => task.id === id);
    //cap nhat trang thai
    tasks[findIndexTask].completed = !tasks[findIndexTask].completed;
    //luu vao local
    localStorage.setItem("tasks", JSON.stringify(tasks));
    const newTasks = [...tasks];
    //cap nhat lai staet de components re-render
    setTasks(newTasks);
  };

  const handleEditTask = () => {
    //vi tri can cap nhat
    const findIndexTask = tasks.findIndex((task) => task.id === editTask.id);
    // cap nhat ten
    tasks[findIndexTask].name = editTask.name;
    //luu len local
    localStorage.setItem("tasks", JSON.stringify(tasks));
    //cap nhat lai state de components re-render
    setTasks([...tasks]);
    handleCloseEdit();
  };

  const handleConfirmDelete = () => {
    //vi tri can xoa
    const filterTasks = tasks.filter((task) => task.id !== taskToDelete.id);
    //luu vao local
    localStorage.setItem("tasks", JSON.stringify(filterTasks));
    //cap nhat lai state de components re-render
    setTasks([...filterTasks]);
    handleCloseDelete();
  };

  const completedTasksCount = tasks.filter((task) => task.completed).length;

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card">
              <div className="card-body p-5">
                <h3 style={{ textAlign: "center", marginBottom: "40px" }}>
                  Danh sách công việc
                </h3>
                <form className="d-flex justify-content-center align-items-center mb-4">
                  <div className="form-outline flex-fill">
                    <input
                      type="text"
                      name="taskInput"
                      id="form2"
                      className="form-control"
                      placeholder="Nhập tên công việc"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                    />
                  {nameError && <div className="text-danger">{nameError}</div>}
                  </div>
                  <button
                    onClick={handleAddTask}
                    className="btn btn-primary ms-2"
                    type="button"
                    >
                    Thêm
                  </button>
                </form>

                <ul className="list-group mb-0">
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className="list-group-item d-flex align-items-center border-0 mb-2 rounded justify-content-between"
                      style={{ backgroundColor: "#f4f6f7" }}
                    >
                      <div>
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id)}
                        />
                        {task.completed ? <s>{task.name}</s> : task.name}
                      </div>
                      <div className="d-flex gap-3">
                        <div>
                        <a
                          href="#!"
                          className="text-info"
                          title="Sửa công việc"
                          onClick={() => handleShowEdit(task)}
                        >
                          <EditOutlined style={{ color: "orange" }} />
                        </a>
                        </div>
                        <div>
                        <a
                          href="#!"
                          className="text-danger"
                          title="Xóa công việc"
                          onClick={() => handleShowDeleteConfirm(task)}
                        >
                          <DeleteOutlined style={{ color: "red" }} />
                        </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <p>
                    Công việc đã hoàn thành: {completedTasksCount} /{" "}
                    {tasks.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showEditModal} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật công việc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTaskName">
              <Form.Label>Tên công việc</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên công việc"
                value={editTask.name}
                onChange={(e) =>
                  setEditTask({ ...editTask, name: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleEditTask}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <ExclamationCircleOutlined style={{ color: "red" }} /> Bạn có xác
            nhận xóa công việc <strong>{taskToDelete?.name}</strong> không?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleConfirmDelete}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

export default TodoList;
