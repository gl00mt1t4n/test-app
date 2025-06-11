# test-app

#### A simple calculator fullstack app with backend deployed in nest.js and frontend deployed using Vita. I have written the logic to handle calculations (i.e Operator Precedences /  BODMAS) as well without relying on any third party modules such as eval()

1. Clone the repo using `git clone https://github.com/gl00mt1t4n/test-app.git`
2. `cd test-app`
3. Run the Backend  
		a. `cd backend`  
		b. `npm run start:dev` run `npm install` before    
		c. It will run backend on localhost:3000  
5. Run the Frontend  
		a. `cd ..`  
		b. `cd frontend`  
		c. `npm run dev` run `npm install` before    
		d. It will run the frontend (connected to backend) on localhost:5173  
7. Test the calculator app!  
8. To run test cases, navigate to test-app/backend and run `npm run test:e2e` 

## Key Features
- Operator precedence including parantheses priority --> Multiplication/Division --> Addition/Subtraction using recursive evaluation function
- Handling for decimals inputs
- Error handling for invalid input, (missing parantheses, extra operators, malformed expressions, etc)
- 13 Test Cases which ensure basic robustness of code

- Logical approaches are commented near the relevant code blocks for reference.
- Basic minimal frontend inside a single page without reloading webpage
