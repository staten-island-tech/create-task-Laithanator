const DOMSelectors = {
  player: document.getElementById("player"),
  dealer: document.getElementById("dealer"),
  buttons: document.getElementById("buttons"),
  new: document.getElementById("new"),
  dTitle: document.getElementById("dealer-title"),
  pTitle: document.getElementById("player-title"),
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
function dealerDisplay() {
  DOMSelectors.dealer.innerHTML = "";
  DOMSelectors.dealer.insertAdjacentHTML(
    "beforeend",
    `<img src="${dealer[0].image}" alt="${dealer[0].value} of ${dealer[0].suit}">
  <img src="backCard.jpeg" alt="back of card">`
  );
  valueCheck(dealer);
  DOMSelectors.dTitle.innerHTML = `Dealer: ${dealer[0].value}`;
}
function displayCards(person, dom) {
  dom.innerHTML = "";
  for (let i = 0; i < person.length; i++) {
    dom.insertAdjacentHTML(
      "beforeend",
      `<img src="${person[i].image}" alt="${person[i].value} of ${person[i].suit}">`
    );
  }
  if (person === player) {
    DOMSelectors.pTitle.innerHTML = `Player: ${valueCheck(player)}`;
  } else {
    DOMSelectors.dTitle.innerHTML = `Dealer: ${valueCheck(dealer)}`;
  }
}
async function newCard(id) {
  let pull = await drawCards(id, 1);
  let card = pull[0];
  return card;
}
function bust(person) {
  let total = valueCheck(person);
  if (total > 21) {
    return true;
  } else {
    return false;
  }
}
let id;
let dealer;
let player;
async function newGame() {
  id = await createNewDeck();
  dealer = await createHand(id);
  player = await createHand(id);
  dealerDisplay(dealer);
  displayCards(player, DOMSelectors.player);
  console.log(`dealer: ${valueCheck(dealer)} player: ${valueCheck(player)}`);
  if (valueCheck(dealer) === 21 || valueCheck(player) === 21) {
    endTurn();
  } else {
    buttons();
  }
}
newGame();
DOMSelectors.new.addEventListener("click", () => {
  newGame();
});
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
  for (let i = 0; i < person.length; i++) {
    if (total > 21) {
      let ace = aceCheck(person, i);
      if (ace !== false) {
        person[ace].value = 1;
        total -= 10;
      }
    }
  }
  return total;
}

async function endTurn() {
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
function aceCheck(person, objNum) {
  if (person[objNum].value === 11) {
    return objNum;
  } else {
    return false;
  }
}
function winner(dealer, player) {
  let playerTotal = valueCheck(player);
  let dealerTotal = valueCheck(dealer);
  let pBust = bust(player);
  let dBust = bust(dealer);
  if (pBust && dBust) {
    DOMSelectors.buttons.innerHTML = "Draw!";
  } else if (pBust) {
    DOMSelectors.buttons.innerHTML = "You lose!";
  } else if (dBust) {
    DOMSelectors.buttons.innerHTML = "You win!";
  } else if (playerTotal === dealerTotal) {
    DOMSelectors.buttons.innerHTML = "Draw!";
  } else if (playerTotal < dealerTotal) {
    DOMSelectors.buttons.innerHTML = "You lose!";
  } else {
    DOMSelectors.buttons.innerHTML = "You win!";
  }
}
async function buttons() {
  DOMSelectors.buttons.innerHTML = "";
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
        endTurn();
      }
    });
    standBtn.addEventListener("click", () => {
      endTurn();
    });
    doubleBtn.addEventListener("click", async () => {
      player.push(await newCard(id));
      displayCards(player, DOMSelectors.player);
      endTurn();
    });
  }
}
