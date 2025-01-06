const DOMSelectors = {
  player: document.getElementById("player"),
  dealer: document.getElementById("dealer"),
  buttons: document.getElementById("buttons"),
};
async function createNewDeck() {
  try {
    const response = await fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    );
    const data = await response.json();
    return data.deck_id;
  } catch (error) {
    console.error("error creating new deck");
  }
}

async function drawCards(deckId, pullNum) {
  try {
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${pullNum}`
    );
    const data = await response.json();
    let cards = await data.cards;
    console.log(`cards pulled: ${cards}`);
    return await cards;
  } catch (error) {
    console.error("error drawing cards");
  }
}

async function createHand(id) {
  const cards = await drawCards(id, 2);
  return cards;
}
function blackCheck(person) {
  let blackJack =
    person.filter(
      (card) =>
        card.value === "ACE" ||
        card.value === "KING" ||
        card.value === "QUEEN" ||
        card.value === "JACK"
    ).length == 2;
  if (blackJack === true) {
    return true;
  } else {
    return false;
  }
}
function dealerDisplay(person) {
  DOMSelectors.dealer.insertAdjacentHTML(
    "beforeend",
    `<img src="${person[0].image}" alt="${person[0].value} of ${person[0].suit}">
  <img src="backCard.jpeg" alt="back of card">`
  );
}
function displayCards(person, dom) {
  dom.innerHTML = "";
  for (let i = 0; i < person.length; i++) {
    dom.insertAdjacentHTML(
      "beforeend",
      `<img src="${person[i].image}" alt="${person[i].value} of ${person[i].suit}">`
    );
  }
}
async function newCard(id) {
  let pull = await drawCards(id, 1);
  let card = pull[0];
  return card;
}
function bust(person) {
  let total = valueCheck(person);
  if (total >= 21) {
    return true;
  } else {
    return false;
  }
}
//start function coming soon!
let id = await createNewDeck();
let dealer = await createHand(id);
let player = await createHand(id);
dealerDisplay(dealer);
displayCards(player, DOMSelectors.player);
function valueCheck(person) {
  let total = 0;
  for (let i = 0; i < person.length; i++) {
    if (
      person[i].value === "KING" ||
      person[i].value === "QUEEN" ||
      person[i].value === "JACK"
    ) {
      person[i].value = 10;
    }
    if (person[i].value === "ACE") {
      person[i].value = 11;
    }
    let value = Number(person[i].value);
    total += value;
  }
  return total;
}
async function endTurn(dealer) {
  DOMSelectors.buttons.innerHTML = "";
  let softCap = false;
  while (!softCap) {
    displayCards(dealer, DOMSelectors.dealer);
    if (valueCheck(dealer) >= 17) {
      softCap = true;
      winner(dealer, player);
      break;
    } else {
      dealer.push(await newCard(id));
      displayCards(dealer, DOMSelectors.dealer);
    }
  }
}
function winner(dealer, player) {
  let playerTotal = valueCheck(player);
  let dealerTotal = valueCheck(dealer);
  let pBust = bust(player);
  let dBust = bust(dealer);
  if ((pBust && dBust) || playerTotal === dealerTotal) {
    DOMSelectors.buttons.innerHTML = "Draw!";
  } else if (pBust || playerTotal < dealerTotal) {
    DOMSelectors.buttons.innerHTML = "You lose!";
  } else if (dBust || playerTotal > dealerTotal) {
    DOMSelectors.buttons.innerHTML = "You win!";
  }
}
if (!blackCheck(dealer)) {
  DOMSelectors.buttons.insertAdjacentHTML(
    "beforeend",
    `<button id="hit">Hit</button>
    <button id="stand">Stand</button>
    <button id="double">Double</button>`
  );
  let hitBtn = document.querySelector("#hit");
  let standBtn = document.querySelector("#stand");
  let doubleBtn = document.querySelector("#double");
  hitBtn.addEventListener("click", async () => {
    player.push(await newCard(id));
    displayCards(player, DOMSelectors.player);
    if (bust(player)) {
      endTurn(dealer);
    }
  });
  standBtn.addEventListener("click", () => {
    eendTurn(dealer);
  });
  doubleBtn.addEventListener("click", async () => {
    player.push(await newCard(id));
    displayCards(player, DOMSelectors.player);
    endTurn(dealer);
  });
}
