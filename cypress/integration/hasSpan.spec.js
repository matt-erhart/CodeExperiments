/// <reference types="cypress" />
/// <reference types="cypress-testing-library" />
// type definitions for custom commands like "createDefaultTodos"
/**
 * getByTestId
 * .should("have.css", "color", "rgb(0, 128, 0)");
    .should((el) => {
      debugger
      expect(el).to.have.css('color', 'rgb(0, 128, 0)')
    })
 */

describe("should animate", () => {
  it("has a color", () => {
    const a = "asdf";
    cy.visit("/b");
    cy.getByTestId("b").click().wait(600).click()
    // .should("have.css", "color", "rgb(0, 128, 0)");
    // .should((el) => {
    //   debugger
    //   expect(el).to.have.css('color', 'rgb(0, 128, 0)')
    // })
  });
});
