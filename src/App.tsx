import React, { useEffect, useState } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

const App = () => {

  const [todos, setTodos]: any = useState([]);
  const [formData, setFormData]: any = useState({
    name: '',
    description: ''
  });
  
  useEffect(() => {
    fetchTodos();
  }, []);
  
  const fetchTodos = async () => {
    const response: any = await API.graphql({
      query: queries.listTodos
    });
    setTodos(response.data?.listTodos?.items)
  }

  const createTodo = async () => {
    if (!formData.name) {
      return;
    }

    const response = await API.graphql({
      query: mutations.createTodo,
      variables: {
        input: formData
      }
    });
    setTodos([...todos, formData]);
    setFormData({
      name: '',
      description: ''
    });
  }

  const handleFormName = (e: any) => {
    setFormData({ ...formData, 'name': e.target.value });
  }

  const handleFormDescription = (e: any) => {
    setFormData({ ...formData, 'description': e.target.value });
  }

  const handleDelete = async ({id}: any) => {
   if (!window.confirm('do you want to delete the todo')) {
    return;
   }
   const newTodosArray = todos.filter((todo: any) => todo.id !== id);
   setTodos(newTodosArray);
   await API.graphql({
    query: mutations.deleteTodo,
    variables: {
      input: {id}
    }
   });
  }

  return (
    <div>
      <h1>Hello world</h1>
      <button onClick={fetchTodos}>Fetch todo</button>

      <div className='todos_top'>
        <h1>Todos</h1>
        <div className='todos_input'>
          <input value={formData.name} placeholder="Todo name" onChange={handleFormName} />
          <input value={formData.description} placeholder="Todo description" onChange={handleFormDescription}/>
        </div>
        <button className='button_create' onClick={() => createTodo()}>Create todo</button>
      </div>
      <div className="container">
        {
          todos.map((todo: any) => {
            return (
              <div className='todoItems' key={todo.id}>
                <div>
                  <h2>{todo.name}</h2>
                  <p>{todo.description}</p>
                </div>
                <button className='button_delete' onClick={() => handleDelete(todo)}>Delete</button>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default App;
