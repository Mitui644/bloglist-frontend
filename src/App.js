import React, { useState, useEffect, useImperativeHandle, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

const Notification = ({notification}) => {
  if (notification.message === null) {
    return null
  }
  let className = 'note'
  if(notification.isError) {
    className += ' error'
  }
  return (
    <div className={className}>
    {notification.message}
  </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState({message: null, isError: false})

  const blogFormToggleRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('userInfo')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const showNotification = (message, isError) => {
    setNotification({message, isError})
    setTimeout(() => {
      setNotification({message: null, isError: false})
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
      window.localStorage.setItem('userInfo', JSON.stringify(user))
      showNotification(`User ${user.username} logged in`, false) 
    } catch (exception) {
      console.log('Invalid credentials')
      showNotification('wrong username or password', true) 
    }
  }

  const logOut = () => {
    const loggedOutUserName = user.username
    setUser(null)
    window.localStorage.clear()
    blogService.setToken(null)
    showNotification(`user ${loggedOutUserName} logged out`, false) 
  }

  const addBlog = (blog) => {
    blogFormToggleRef.current.toggleVisibility()

    blogService
      .create(blog)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, false)
      })
  }

  const addLike = async (blog) => {
    const changedBlog = { 
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
  
    try {
      const returnedBlog = await blogService.update(blog.id, changedBlog)
      setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
      showNotification(`a like added to blog ${returnedBlog.title} by ${returnedBlog.author}`, false)

    } catch(error) {
      showNotification(`not able to add a like to blog ${blog.title} by ${blog.author}`, true)
    }  
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
    <div>
      username
        <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
        <input
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
    </form>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      {
      user
      ?
      (
        <>
        <p>{user.username} logged in<button onClick={logOut}>logout</button></p>
        <h2>create new</h2>
        <Togglable buttonLabel='create new blog' ref={blogFormToggleRef}>
          <BlogForm addBlog={addBlog}/>
        </Togglable>
        {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} addLike={addLike} />
        )}
        </>
      )   
      :
      (
      <> 
        <h2>log in to application</h2>
        {loginForm()}
      </>
      )
      }
    </div>
  )
}

export default App