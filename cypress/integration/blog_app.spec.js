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
})