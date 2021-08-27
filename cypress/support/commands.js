Cypress.Commands.add('createBlog', (blog) => {
    cy.request({
      url: 'http://localhost:3003/api/blogs',
      method: 'POST',
      body: blog,
      headers: {
        'Authorization': `bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
      }
    })
  
    cy.visit('http://localhost:3000')
  })
