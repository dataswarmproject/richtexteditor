context('/Examples/AIDocumentEditor', () => {
  before(() => {
    cy.visit('/Examples/AIDocumentEditor')
  })

  beforeEach(() => {
    cy.get('.ProseMirror').then(([{ editor }]) => {
      editor.commands.clearContent()
    })
  })

  it('should render the AI Document Editor', () => {
    cy.get('.ai-document-editor').should('exist')
    cy.get('.ProseMirror').should('exist')
  })

  it('should have a toolbar', () => {
    cy.get('.ai-document-editor-toolbar').should('exist')
  })

  it('should have a status bar', () => {
    cy.get('.ai-document-editor-statusbar').should('exist')
  })

  it('should allow typing text', () => {
    cy.get('.ProseMirror').type('Hello, World!')
    cy.get('.ProseMirror').should('contain', 'Hello, World!')
  })

  it('should toggle bold with keyboard shortcut', () => {
    cy.get('.ProseMirror').type('{selectAll}')
    cy.get('.ProseMirror').type('{ctrl+b}')
    cy.get('.ProseMirror').find('strong').should('exist')
  })

  it('should open AI assistant with keyboard shortcut', () => {
    cy.get('.ProseMirror').type('{ctrl+j}')
    cy.get('.ai-assistant-panel').should('be.visible')
  })
})
