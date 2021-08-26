import React, { useState, useEffect, useImperativeHandle, useRef } from 'react'
import Blog from './components/Blog'
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

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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

  const addBlog = (event) => {
    event.preventDefault()
    blogFormToggleRef.current.toggleVisibility()

    const blog = {
      title: title,
      author: author,
      url: url,
    }

    blogService
      .create(blog)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setTitle('')
          setAuthor('')
          setUrl('')
          showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, false)

      })
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

  const blogForm = () => (
    <form onSubmit={addBlog}>
    <div>
      title:
        <input
        type="text"
        value={title}
        name="title"
        onChange={({ target }) => setTitle(target.value)}
      />
    </div>
    <div>
      author:
        <input
        type="text"
        value={author}
        name="author"
        onChange={({ target }) => setAuthor(target.value)}
      />
    </div>
    <div>
      url:
        <input
        type="text"
        value={url}
        name="url"
        onChange={({ target }) => setUrl(target.value)}
      />
    </div>
      <button type="submit">create</button>
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
          {blogForm()}
        </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
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