import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { useState, useEffect } from "react";

export default function Home() {
  const [draggedTask, setDraggedTask] = useState();
  const [progressTaskInput, setProgressTaskInput] = useState()
  const [completedTaskInput, setCompletedTaskInput] = useState()
  const [inProgressTasks, setInProgressTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])

const updateTask = async (taskType, task) => {
  const response = await fetch('/api/tasks', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      id: task.id,
      newType: taskType
    })
  })
  setCompletedTasks([...completedTasks,task])
 return response.ok
}
  const addTask = async (taskType, task) => {
    
    if (taskType === 'progress') {
      if (!task) {
        task = {
          title: progressTaskInput,
          description: '',
          type: taskType
        }
      }
      // make call to API
     const response = await fetch('/api/tasks', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(task)
      })
      if (response.ok) {
        const record = await response.json()
        console.log("record", record)
        task.id = record[0].id
        // only run setInProgressTasks if it's successful
        setInProgressTasks([...inProgressTasks, task])  
        setProgressTaskInput('') 
      }
     
    } else if (taskType === 'completed') {
      if (!task) {
        task = {
          title: completedTaskInput,
          description: '',
          type: taskType
        }
      }
      const response = await fetch('/api/tasks', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(task)
      })
      console.log('check', [...completedTasks,task])
      if (response.ok) {
        setCompletedTasks([...completedTasks,task])
        setCompletedTaskInput('')
      }
    }
  }

  const deleteTask = async (taskType, index, id) => {
    if (taskType === 'progress') {
      // make call to API
      // only run setInProgressTasks if it's successful
      const temp = [...inProgressTasks]
      temp.splice(index, 1)
      console.log("temp", temp)
      setInProgressTasks(temp)
    } else if (taskType === 'completed') {
      const temp = [...completedTasks]
      temp.splice(index, 1)
      setCompletedTasks(temp)
    }
    const response = await fetch(`/api/tasks/${id}`, { 
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
    })
  }

  useEffect(() => {
    async function getTasks() {
      const response = await fetch('/api/tasks');
      const tasks = await response.json()
      const tempCompletedTasks = [];
      const tempProgressTasks = []
      tasks.forEach((task) => {
        if (task.type === 'completed') {
          tempCompletedTasks.push(task) 
        } else if (task.type === 'progress') {
          tempProgressTasks.push(task)
        }
      })
      setCompletedTasks(tempCompletedTasks)
      setInProgressTasks(tempProgressTasks)
    }
    getTasks()
  }, []);

  console.log(completedTasks)
  return (
    <div className={styles.container}>
      <Head>
        <title>CPSC 458 Final Project</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1 className={styles.title}>Task Manager</h1>
      </header>

      <main className={styles.board}>
        <div className={styles.column}>
          <h2 className={styles.columnTitle}>Tasks In-Progress</h2>
          <div className={styles.taskColumn}>
            {inProgressTasks && inProgressTasks.map((task, i) => {
              return  <div key={task.id} className={styles.card} draggable onDrag={(e) => {
                e.preventDefault()
                setDraggedTask(task)
              }}>
                <div className={styles.textContainer}>
                  <p>{task.title}</p>
                </div>
                <div className={styles.deleteContainer}>
                  <button className={styles.deleteButton} onClick={() => {
                    deleteTask('progress', i, task.id)
                  }}>Delete</button>
                </div>
              </div>
            })}
            <div className={styles.addContainer}>
              <input
                 value={progressTaskInput} 
                 onChange={(e) => setProgressTaskInput(e.target.value)} 
                 type="text" className={styles.newTaskInput} 
                 placeholder="Create New Task"
                 onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTask('progress')
                  }
                 }} />
               <button className={styles.newTaskButton} onClick={() => addTask('progress')}>Add Task</button>
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <h2 className={styles.columnTitle}>Tasks Completed</h2>
          <div className={styles.taskColumn} 
          onDragOver={(e) => {
            e.preventDefault()
          }}
          onDrop={(e) => {
            console.log('ondrop')
            updateTask('completed', draggedTask)

            const temp = [...inProgressTasks]
            let foundIndex = null
            inProgressTasks.forEach((task, i) => {
              console.log(task.id, draggedTask.id)
              if (task.id === draggedTask.id) {
                foundIndex = i
              }
            })
            if (foundIndex !== null) {
              temp.splice(foundIndex, 1)
            }
              setInProgressTasks(temp)
              setCompletedTasks([...completedTasks, draggedTask])
          }}>
          {completedTasks && completedTasks.map((task, i) => {
              return  <div key={task.id} className={styles.card}>
                <div className={styles.textContainer}>
                  <p>{task.title}</p>
                </div>
                <div className={styles.deleteContainer}>
                  <button className={styles.deleteButton} onClick={() => {
                    deleteTask('completed', i, task.id)
                  }}>Delete</button>
                </div>
              </div>
            })}
            <div className={styles.addContainer}>  
              <input 
                 value={completedTaskInput} 
                 onChange={(e) => setCompletedTaskInput(e.target.value)} 
                 type="text" className={styles.newTaskInput} 
                 placeholder="Create New Task"  
                 onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // do something to update the task
                    addTask('completed')
                  }
                 }} />
                  <button className={styles.newTaskButton} onClick={() => addTask('completed')}>Add Task</button>
            </div>
          </div>
        </div>
        {/* Add more columns here */}
      </main>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap');
        .${styles.container} {
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          background-color: #f4f5f7;
          background-color: #778A35;
        }
        .${styles.header} {
          background-color: #026aa7;
          color: #fff;
          padding: 1em;
          text-align: center;
        }
        .${styles.board} {
          display: flex;
          justify-content: space-around;
          padding: 1em;
          border-radius: 10px;
          flex-wrap: wrap;

        }
        .${styles.column} {
          background-color: #D1E2C4;
          border-radius: 10px;
          
          padding: 0.5em;
          flex-direction: column;
        }
        .${styles.columnTitle} {
          color: #31352E;
          margin: 0.5em 10px;
          font-family: 'Roboto Condensed', sans-serif;
        }
        .${styles.card} {
          background-color: #EBEBE8;
          border-radius: 3px;
          margin-bottom: 0.5em;
          padding: 0.5em;
          box-shadow: 0 1px 0 rgba(9,30,66,.25);
          color: #31352E;
        }
        .${styles.footer} {
          background-color: #026aa7;
          color: #fff;
          text-align: center;
          padding: 1em;
        }
      
      `}</style>
    </div>
  )
}