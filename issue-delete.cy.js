//Declaring constants

const issueTitle = "This is an issue of type: Task.";
const issueDetViewModal = '[data-testid="modal:issue-details"]';
const modalConfirm = '[data-testid="modal:confirm"]';
const boardBacklog = '[data-testid="board-list:backlog"]';
const iconTrash = '[data-testid="icon:trash"]';
const deleteTitle = "Are you sure you want to delete this issue?";

describe("Deleting an Issue", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
      });
  });

  it("Should delete issue successfully", () => {
    cy.get(issueDetViewModal).should("be.visible");
    cy.get(iconTrash).click();
    cy.get(modalConfirm).should("be.visible");
    cy.get(modalConfirm).within(() => {
      cy.contains(deleteTitle).should("be.visible");
      cy.contains("Delete issue").click();
    });

    cy.get(modalConfirm).should("not.exist");

    cy.get(boardBacklog).within(() => {
      cy.contains(issueTitle).should("not.exist");
    });
  });

  it("Should cancel delete issue process successfully", () => {
    cy.get(issueDetViewModal).should("be.visible");
    cy.get(iconTrash).click();
    cy.get(modalConfirm).should("be.visible");
    cy.get(modalConfirm).within(() => {
      cy.contains(deleteTitle).should("be.visible");
      cy.contains("Cancel").click();
    });

    cy.get(modalConfirm).should("not.exist");
    cy.get('[data-testid="icon:close"]').first().click();
    cy.get(issueDetViewModal).should("not.exist");

    cy.get(boardBacklog).within(() => {
      cy.contains(issueTitle).should("be.visible");
    });
  });
});
