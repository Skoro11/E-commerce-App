describe('Fundamentals test', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000');
  });

  it('Adding and deleting product passed', () => {
    cy.visit('http://localhost:3000/admin');

    // Adding product
    cy.get('.add__product__btn').click();
    cy.get('[name="id"]').type(4);
    cy.get('[name="ProductName"]').type('Product name');
    cy.get('.description__preview').type(
      'Experience unmatched performance with our sleek, durable, and innovative wireless earbuds.'
    );
    cy.get('[min="1"]').type(250);
    cy.get('[min="0"]').type(30);
    cy.get('[name="Category"]').select('Flash Sales');
    cy.get('[name="Tag"]').select('New');
    cy.get('.blue').click();
    cy.get(':nth-child(33)').click();

    // Assert product added
    cy.get('tbody > :nth-child(4) > :nth-child(1)').should('contain', '4');
    cy.get(':nth-child(4) > :nth-child(2)').should('contain', 'Product name');
    cy.get(':nth-child(4) > :nth-child(4)').should('contain', '$250');
    cy.get(':nth-child(4) > :nth-child(5)').should('contain', 'New');
    cy.get(':nth-child(4) > :nth-child(6)').should('contain', '$30');
    cy.get(':nth-child(4) > :nth-child(7) > .category__tag').should('contain', 'Flash Sales');
    cy.get(':nth-child(4) > :nth-child(8)').should('exist');
    cy.get(':nth-child(4) > .operations > .edit__btn').should('contain', 'Edit');
    cy.get(':nth-child(4) > .operations > .delete__btn').should('contain', 'Delete');

    // Delete product
    cy.get(':nth-child(4) > .operations > .delete__btn').click();
    
    // Assert that the product is deleted
    cy.get('tbody > :nth-child(4) > :nth-child(1)').should('not.exist');
    cy.get(':nth-child(4) > :nth-child(2)').should('not.exist');
    cy.get(':nth-child(4) > :nth-child(4)').should('not.exist');
    cy.get(':nth-child(4) > :nth-child(5)').should('not.exist');
    cy.get(':nth-child(4) > :nth-child(6)').should('not.exist');
    cy.get(':nth-child(4) > :nth-child(7) > .category__tag').should('not.exist');
    
  });

  it('Updating Product passed', () => {
    cy.visit('http://localhost:3000/admin');

    cy.get(':nth-child(1) > .operations > .edit__btn').click();
    cy.get('[value="1"]')
    .clear()
    .type(2);

    cy.get('[value="Joystick"]')
    .clear()
    .type("Red Dress");

    cy.get('.description__preview')
    .clear()
    .type("A vibrant red dress that exudes elegance and confidence. Crafted from a soft, flowing fabric, it features a flattering silhouette with a figure-hugging bodice and a graceful A-line skirt. ")
 
    cy.get('[min="1"]')
    .clear()
    .type(420)
    
    cy.get('[min="0"]')
    .clear()
    .type(200)

    cy.get('[name="Category"]').select("Best Selling")

    cy.get('[name="Tag"]').select("-50%")

    cy.get('.red').click();
    cy.get('.blue').click();
    cy.get('.green').click();
    cy.get('.yellow').click();
    cy.get(".purple").click();


    cy.get('.update__btn').click();

    // Extract and validate the URL
     cy.url().should('include', '/admin').then((url) => {
    // Parse the query string
    const urlParams = new URLSearchParams(url.split('?')[1]);

    // Validate specific parameters
    expect(urlParams.get('id')).to.eq('2');
    expect(urlParams.get('ProductName')).to.eq('Red Dress');
    expect(urlParams.get('Description')).to.eq(
      'A vibrant red dress that exudes elegance and confidence. Crafted from a soft, flowing fabric, it features a flattering silhouette with a figure-hugging bodice and a graceful A-line skirt. '
    );
    expect(urlParams.get('Price')).to.eq('420');
    expect(urlParams.get('DiscountedPrice')).to.eq('200');
    expect(urlParams.get('Category')).to.eq('Best Selling');
    expect(urlParams.get('Tag')).to.eq('-50%');
  });
})

  it("Chat GPT API " , () => {
    // Define the API endpoint and the payload
    const apiUrl = Cypress.env('OPENAI_API_URL'); 
    const payload = {
      model: "gpt-4o-mini",
      store: true,
      messages: [
        { role: "user", content: "Please confirm if you're receiving and processing this request." }
      ]
    };

    // Send the request to the API
    cy.request({
      method: 'POST',
      url: apiUrl,
      body: payload,
      headers: {
        'Authorization': 'Bearer '+ Cypress.env("OPENAI_API_KEY") , // If your API requires an API key, include it here
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      // Assert that the response status is 200 (OK)
      expect(response.status).to.eq(200);

      // Optionally, assert that the response contains the expected answer
      expect(response.body).to.have.property('choices'); // Modify based on the response structure
      expect(response.body.choices[0].message.content).to.include('receiving and processing');
    });
  });


});
