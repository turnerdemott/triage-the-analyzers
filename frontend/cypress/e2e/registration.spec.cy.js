// The registration endpoints take courseId and sectionId as required integers. A link that lacks either one
// (cut short by a mail client, or hand-edited) must be refused up front, like a link without a token, instead of
// showing a form whose submission can only fail. vue-tsc flagged parseInt(courseId) with courseId possibly undefined.
describe('User registration link', () => {
  beforeEach(() => {
    // The address is not registered yet, so a valid link would show the form
    cy.intercept('GET', '**/users/exists/**', { flag: true, code: 200, message: 'ok', data: false })
  })

  it('refuses a link without courseId and sectionId', () => {
    cy.visit('/register?email=new.student@abc.edu&token=registrationToken&role=student')

    cy.contains('Invalid registration link').should('be.visible')
    cy.url().should('include', '/403')
  })

  it('refuses a link whose sectionId is not a number', () => {
    cy.visit('/register?email=new.student@abc.edu&token=registrationToken&courseId=1&sectionId=null&role=student')

    cy.contains('Invalid registration link').should('be.visible')
    cy.url().should('include', '/403')
  })

  it('shows the form for a complete link', () => {
    cy.visit('/register?email=new.student@abc.edu&token=registrationToken&courseId=1&sectionId=2&role=student')

    cy.url().should('include', '/register')
    cy.get('input[type="password"]').should('exist')
  })
})
