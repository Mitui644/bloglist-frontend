import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, addLike, deleteBlog, showDeleteButton }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const pressLike = () => {
    addLike(blog)
  }

  const pressRemove = () => {
    deleteBlog(blog)
  }

  return (
    <div style={blogStyle}>
      <div>{blog.title} {blog.author} <button onClick={toggleDetails}>{showDetails ? 'hide' : 'view'}</button></div>
      {showDetails && (
        <>
          <div>{blog.url}</div>
          <div className='likeField'>likes {blog.likes}<button onClick={pressLike}>like</button></div>
          <div>{blog.user.username}</div>
          {showDeleteButton && <button onClick={pressRemove}>remove</button>}
        </>
      )
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  showDeleteButton: PropTypes.bool.isRequired
}

export default Blog