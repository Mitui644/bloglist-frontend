import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BLogForm from './BlogForm'

test('<BlogForm /> calls onSubmit with the right details', () => {
  const addBlog = jest.fn()

  const component = render(
    <BLogForm addBlog={addBlog} />
  )

  const inputAuthor = component.container.querySelector('#author')
  const inputTitle = component.container.querySelector('#title')
  const inputUrl = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(inputAuthor, { target: { value: 'test_author' } })
  fireEvent.change(inputTitle, { target: { value: 'test_title' } })
  fireEvent.change(inputUrl, { target: { value: 'test_url' } })
  fireEvent.submit(form)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].author).toBe('test_author')
  expect(addBlog.mock.calls[0][0].title).toBe('test_title')
  expect(addBlog.mock.calls[0][0].url).toBe('test_url')
})