import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'test_title', author: 'test_author', url: 'test_url', likes: 0
  }

  const component = render(
    <Blog blog={blog} addLike={jest.fn()} deleteBlog={jest.fn()} showDeleteButton={false}/>
  )

  expect(component.container).toHaveTextContent('test_title')
  expect(component.container).toHaveTextContent('author')

  expect(component.container).not.toHaveTextContent('test_url')
  expect(component.container).not.toHaveTextContent('likes ' + blog.likes)
})