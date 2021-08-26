import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component

  const blog = {
    author: 'test_author',
    id: '612643f241c93c5580d4e65f',
    likes: 0,
    title: 'test_title',
    url: 'test_url',
    user: {
      username: 'pete',
      name: 'petes name here',
      id: '612614ed6121223be561de52'
    }
  }


  beforeEach(() => {
    component = render(
      <Blog blog={blog} addLike={jest.fn()} deleteBlog={jest.fn()} showDeleteButton={false}/>
    )
  })

  test('renders content without details at start', () => {

    expect(component.container).toHaveTextContent('test_title')
    expect(component.container).toHaveTextContent('author')

    expect(component.container).not.toHaveTextContent('test_url')
    expect(component.container).not.toHaveTextContent('likes ' + blog.likes)
  })

  test('after clicking the button view, details are displayed', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent('test_title')
    expect(component.container).toHaveTextContent('author')

    expect(component.container).toHaveTextContent('test_url')
    expect(component.container).toHaveTextContent('likes ' + blog.likes)
  })

})