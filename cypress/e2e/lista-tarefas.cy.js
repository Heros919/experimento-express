describe('Lista de tarefas', () => {
 beforeEach(() => {
 cy.clearLocalStorage();
 cy.visit('/');
 });

 it('deve exibir o título da aplicação', () => {
 cy.contains('Lista de tarefas').should('be.visible');
 });

 it('deve adicionar uma nova tarefa', () => {
 cy.get('[data-cy="task-input"]')
 .type('Estudar Cypress');
 cy.get('[data-cy="add-button"]')
 .click();
 cy.get('[data-cy="task-list"]')
 .should('contain', 'Estudar Cypress');
 cy.get('[data-cy="task-count"]')
 .should('have.text', '1');
 });

 it('não deve adicionar uma tarefa vazia', () => {
 cy.get('[data-cy="add-button"]')
 .click();
 cy.get('[data-cy="error-message"]')
 .should('have.text', 'Digite uma tarefa antes de adicionar.');
 cy.get('[data-cy="task-count"]')
 .should('have.text', '0');
 });

 it('deve remover uma tarefa', () => {
 cy.get('[data-cy="task-input"]')
 .type('Tarefa temporária');
 cy.get('[data-cy="add-button"]')
 .click();
 cy.get('[data-cy="remove-button"]')
 .click();
 cy.get('[data-cy="task-list"]')
 .should('not.contain', 'Tarefa temporária');
 cy.get('[data-cy="task-count"]')
 .should('have.text', '0');
 });

 it('deve limpar o campo depois de adicionar uma tarefa', () => {
 cy.get('[data-cy="task-input"]')
 .type('Ler documentação');
 cy.get('[data-cy="add-button"]')
 .click();
 cy.get('[data-cy="task-input"]')
 .should('have.value', '');
 });

 it('deve marcar uma tarefa como concluída', () => {
 cy.get('[data-cy="task-input"]').type('Revisar código');
 cy.get('[data-cy="add-button"]').click();
 cy.get('[data-cy="complete-checkbox"]').check();
 cy.get('[data-cy="task-list"] li').should('have.class', 'completed');
 });

 it('deve remover todas as tarefas', () => {
 cy.get('[data-cy="task-input"]').type('Primeira tarefa');
 cy.get('[data-cy="add-button"]').click();
 cy.get('[data-cy="task-input"]').type('Segunda tarefa');
 cy.get('[data-cy="add-button"]').click();
 cy.get('[data-cy="remove-all-button"]').click();
 cy.get('[data-cy="task-count"]').should('have.text', '0');
 cy.get('[data-cy="task-list"]').should('be.empty');
 });

 it('deve manter as tarefas depois de recarregar a página', () => {
 cy.get('[data-cy="task-input"]').type('Tarefa persistente');
 cy.get('[data-cy="add-button"]').click();
 cy.reload();
 cy.get('[data-cy="task-list"]').should('contain', 'Tarefa persistente');
 });

 it('deve filtrar tarefas concluídas', () => {
 cy.get('[data-cy="task-input"]').type('Tarefa concluída');
 cy.get('[data-cy="add-button"]').click();
 cy.get('[data-cy="task-input"]').type('Tarefa pendente');
 cy.get('[data-cy="add-button"]').click();
 cy.get('[data-cy="complete-checkbox"]').first().check();
 cy.get('[data-cy="task-filter"]').select('completed');
 cy.get('[data-cy="task-list"]').should('contain', 'Tarefa concluída');
 cy.get('[data-cy="task-list"]').should('not.contain', 'Tarefa pendente');
 });
});