const DOMSelectors = {
  player: document.getElementById("player"),
  dealer: document.getElementById("dealer"),
  buttons: document.getElementById("buttons"),
  new: document.getElementById("new"),
  dTitle: document.getElementById("dealer-title"),
  pTitle: document.getElementById("player-title"),
  betDiv: document.getElementById("betting"),
  betBtn: document.getElementById("bet-btn"),
  betForm: document.getElementById("bet-form"),
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
  DOMSelectors.dealer.innerHTML = `<div class="bg-white border border-black rounded-lg p-2">
          <h2
            class="w-full text-center text-2xl font-bold mb-4"
            id="dealer-title"
          >
            Dealer
          </h2>
        </div>`;
  DOMSelectors.dealer.insertAdjacentHTML(
    "beforeend",
    `<img src="${dealer[0].image}" alt="${dealer[0].value} of ${dealer[0].suit}">
  <img src="backCard.jpeg" alt="back of card">`
  );
  DOMSelectors.dTitle = document.querySelector("#dealer-title");
  valueCheck(dealer);
  DOMSelectors.dTitle.innerHTML = `Dealer: ${dealer[0].value}`;
}
function displayCards(person, dom) {
  if (person === player) {
    dom.innerHTML = `<div class="bg-white border border-black rounded-lg p-2">
          <h2
            id="player-title"
            class="w-full text-center text-2xl font-bold mb-4"
          >
            Player
          </h2>
        </div>`;
  } else {
    dom.innerHTML = `<div class="bg-white border border-black rounded-lg p-2">
          <h2
            class="w-full text-center text-2xl font-bold mb-4"
            id="dealer-title"
          >
            Dealer
          </h2>
        </div>`;
  }
  for (let i = 0; i < person.length; i++) {
    dom.insertAdjacentHTML(
      "beforeend",
      `<img src="${person[i].image}" alt="${person[i].value} of ${person[i].suit}">`
    );
  }
  DOMSelectors.pTitle = document.querySelector("#player-title");
  DOMSelectors.dTitle = document.querySelector("#dealer-title");
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
betting();
newGame();
DOMSelectors.new.addEventListener("click", async () => {
  DOMSelectors.new.disabled = true;
  try {
    await newGame();
  } catch (error) {
    console.error("Error during new game:", error);
  } finally {
    DOMSelectors.new.disabled = false;
  }
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
    DOMSelectors.buttons.innerHTML = `<button class="btn btn-primary w-32">Draw!</button>
<button id="new" class="btn btn-success w-32">New Game</button>`;
  } else if (pBust) {
    DOMSelectors.buttons.innerHTML = `<button class="btn btn-primary w-32">You lose!</button>
<button id="new" class="btn btn-success w-32">New Game</button>`;
  } else if (dBust) {
    DOMSelectors.buttons.innerHTML = `<button class="btn btn-primary w-32">You win!</button>
<button id="new" class="btn btn-success w-32">New Game</button>`;
  } else if (playerTotal === dealerTotal) {
    DOMSelectors.buttons.innerHTML = `<button class="btn btn-primary w-32">Draw!</button>
<button id="new" class="btn btn-success w-32">New Game</button>`;
  } else if (playerTotal < dealerTotal) {
    DOMSelectors.buttons.innerHTML = `<button class="btn btn-primary w-32">You lose!</button>
<button id="new" class="btn btn-success w-32">New Game</button>`;
  } else {
    DOMSelectors.buttons.innerHTML = `<button class="btn btn-primary w-32">You win!</button>
<button id="new" class="btn btn-success w-32">New Game</button>`;
  }
  DOMSelectors.new = document.querySelector("#new");
  DOMSelectors.new.addEventListener("click", () => {
    newGame();
  });
}
async function buttons() {
  DOMSelectors.buttons.innerHTML = `<button id="new" class="btn btn-success w-32">New Game</button>`;
  if (!blackCheck(dealer)) {
    DOMSelectors.buttons.insertAdjacentHTML(
      "beforeend",
      `<button id="hit" class="btn btn-primary w-32">Hit</button>
  <button id="stand" class="btn btn-secondary w-32">Stand</button>
  <button id="double" class="btn btn-accent w-32">Double</button>`
    );
    let hitBtn = document.querySelector("#hit");
    let standBtn = document.querySelector("#stand");
    let doubleBtn = document.querySelector("#double");
    hitBtn.addEventListener("click", async () => {
      hitBtn.disabled = true;
      try {
        player.push(await newCard(id));
        displayCards(player, DOMSelectors.player);
        if (bust(player)) {
          endTurn();
        }
      } catch (error) {
        console.error("Error during hit:", error);
      } finally {
        hitBtn.disabled = false;
      }
    });
    standBtn.addEventListener("click", () => {
      standBtn.disabled = true;
      try {
        endTurn();
      } catch (error) {
        console.error("Error during stand:", error);
      } finally {
        standBtn.disabled = false;
      }
    });
    doubleBtn.addEventListener("click", async () => {
      doubleBtn.disabled = true;
      try {
        player.push(await newCard(id));
        displayCards(player, DOMSelectors.player);
        endTurn();
      } catch (error) {
        console.error("Error during new game:", error);
      } finally {
        doubleBtn.disabled = false;
      }
    });
  }
}
function betting() {
  DOMSelectors.betForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let bet = document.querySelector(".name").value;

    if (bet > 0) {
      DOMSelectors.betDiv.innerHTML = `<p>Player Bet: ${bet}</p>`;
    }
  });
}
