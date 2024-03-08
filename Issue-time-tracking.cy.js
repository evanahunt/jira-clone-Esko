describe("Issue time tracking functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  function getPlaceholderNumberClear() {
    return cy.get('[placeholder="Number"]').clear();
  }
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const getPlaceholderNumber = () => cy.get('[placeholder="Number"]');
  const getIconStopwatch = () => cy.get('[data-testid="icon:stopwatch"]');
  const timeSpent = 2;
  const timeRemaining = 5;

  it("Should add, update and remove estimated time successfully", () => {
    getIssueDetailsModal().within(() => {
      //Add estimated time
      getPlaceholderNumberClear().type(10);
      cy.contains("div", "4h logged").should("be.visible");
      cy.contains("div", "10h estimated").should("be.visible");

      //Edit estimated time
      getPlaceholderNumberClear().type(20);
      cy.contains("div", "4h logged").should("be.visible");
      cy.contains("div", "20h estimated").should("be.visible");

      //Remove estimated time
      getPlaceholderNumberClear();
      cy.contains("div", "4h logged").should("be.visible");
      cy.contains("div", "20h estimated").should("not.exist");
    });
    //Close the modal, open it again and assure that placeholder "Number" is visible
    getIssueDetailsModal().get('[data-testid="icon:close"]').first().click();
    cy.get('[data-testid="list-issue"]')
      .first()
      .find("p")
      .contains("This is an issue of type: Task.")
      .click();
    getPlaceholderNumber().should("be.visible");
  });

  it("Should log time and remove logged time successfully", () => {
    //Add logged time and assure that it is visible
    getIconStopwatch().should("be.visible").click();

    cy.get('[data-testid="modal:tracking"]').within(() => {
      getPlaceholderNumber().eq(0).clear().type(timeSpent);
      getPlaceholderNumber().eq(1).type(timeRemaining);

      getPlaceholderNumber().eq(0).should("have.value", timeSpent);
      getPlaceholderNumber().eq(1).should("have.value", timeRemaining);

      cy.contains("button", "Done").click().should("not.exist");
    });

    //Assure that time spent and time remaining values are visible
    cy.contains("div", "2h logged").should("be.visible");
    cy.contains("div", "5h remaining").should("be.visible");

    //Remove logged time
    getIconStopwatch().should("be.visible").click();

    cy.get('[data-testid="modal:tracking"]').within(() => {
      getPlaceholderNumber().eq(0).clear();
      getPlaceholderNumber().eq(1).clear();

      cy.contains("button", "Done").click().should("not.exist");
    });

    //Assure that time spent and time remaining values are removed
    cy.contains("div", "No time logged").should("be.visible");
    cy.contains("div", "8h estimated").should("be.visible");
  });
});
