
function calculateMaturityAmount(){
   
   const principal = parseFloat(document.getElementById("principal").value);
   const interestRate = parseFloat(document.getElementById("interestRate").value);
   const tenure = parseFloat(document.getElementById("tenure").value);
   const maturityAmount = principal +  (principal * interestRate * tenure)/100;

   // display the result
   document.getElementById('result').innerHTML = `Maturity Amount: ${maturityAmount.toFixed(2)}`;
   
    }
// attach the event listener to the calculate button
const  calculateBtn = document.getElementById('calculateBtn');
calculateBtn.addEventListener('click', calculateMaturityAmount);

// ...existing code...

// Clear button functionality
const clearBtn = document.getElementById('clearBtn');

clearBtn.addEventListener('click', function() {
    document.getElementById('principal').value = '';
    document.getElementById('interestRate').value = '';
    document.getElementById('tenure').value = '';
    document.getElementById('result').innerHTML = 'Maturity Amount'; // Reset the result display
});