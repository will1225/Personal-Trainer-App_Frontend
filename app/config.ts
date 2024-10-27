// Production/Testing flag
let production = false; // Set to true in Production
let endpoint = production ? `https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev` : `http://10.10.6.150:8080`; // Replace with your own ip4 address for test

export { production, endpoint };