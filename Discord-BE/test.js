const numbers = [1, 2, 3, 4];
let doubled = [];
for (let i = 0; i < numbers.length; i++) {
  doubled.push(numbers[i] * 2);
}


const doubledFP = numbers.map((x) => x * 2);