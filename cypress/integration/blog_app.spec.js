describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'root',
      username: 'exampleUsername',
      password: 'examplePassword'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username').find('input')
    cy.contains('password').find('input')
  })

  describe('Login',function() {

    it('succeeds with correct credentials', function() {
      cy.get('input:first').type('exampleUsername')
      cy.get('input:last').type('examplePassword')
      cy.contains('login').click()
      cy.contains('exampleUsername logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input:first').type('not real username')
      cy.get('input:last').type('not real password')
      cy.contains('login').click()

      cy.get('.error')
      .should('contain', 'wrong username or password')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'exampleUsername logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'exampleUsername', password: 'examplePassword'
      }).then(response => {
        localStorage.setItem('userInfo', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('example blog title')
      cy.get('#author').type('example blog author')
      cy.get('#url').type('example blog url')
      cy.get('form').contains('create').click()

      cy.wait(7000) // Wait for notification bar to disappear
      cy.contains('example blog title').contains('example blog author').contains('view')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'like this blog',
          author: 'another blog cypress',
          url: 'asd url'
        })
      })

      it('user can like the blog', function () {
        cy.contains('like this blog').find('button').click()
        cy.contains('like this blog').parent().as('blogDiv')
        cy.get('@blogDiv').contains('likes 0')
        cy.get('button').contains('like').click()
        cy.get('@blogDiv').contains('likes 1')
      })

      it('user can delete the blog', function () {
        cy.contains('like this blog').find('button').click()
        cy.contains('like this blog').parent().as('blogDiv')
        cy.get('button').contains('remove').click()

        cy.wait(7000) // Wait for notification bar to disappear
        cy.get('html').should('not.contain', 'like this blog')
        cy.get('html').should('not.contain', 'another blog cypres')
      })
    })
    describe('and several blogs exists with likes', function () {
      beforeEach(function () {

        const blogCount = 10

        for(let i = 0; i < blogCount; ++i) {
          cy.createBlog({
            title: `blog number ${i}`,
            author: 'some author here',
            url: 'asd url'
          })
        }

        for(let i = 0; i < blogCount; ++i) {
          // Open details of each blog
          cy.contains(`blog number ${i}`).find('button').click()
        }

        for(let i = 0; i < blogCount; ++i) {
          cy.contains(`blog number ${i}`).parent().as(`blogDiv${i}`)
          for(let j = 0; j < i; ++j) {
            cy.get(`@blogDiv${i}`).find('button').contains('like').click()
            cy.wait(100)
          }
        }
      })

      it('blogs are sorted by likes', function () {
        let blogCount = 10
        cy.get('.likeField').then((likes) => {

          for(let i = 0; i < blogCount; ++i) {
            cy.wrap(likes).eq(i).contains(`likes ${blogCount - (i + 1)}`)
          }
        })
      })
    })
  })
})