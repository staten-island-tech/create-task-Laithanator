const DOMSelectors = {
  player: document.getElementById("player"),
  dealer: document.getElementById("dealer"),
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
async function newGame() {
  const id = await createNewDeck();
  const dealer = await dealerHand();
  const player = [];
}
async function dealerHand(id) {
  const cards = await drawCards(id, 2);
  let blackJack;
  blackJack =
    cards.filter(
      (card) =>
        card.value === "ACE" ||
        card.value === "KING" ||
        card.value === "QUEEN" ||
        card.value === "JACK"
    ).length == 2;
  if (blackJack) {
    return blackJack;
  } else {
    return cards;
  }
}
async function playerHand(id) {
  const cards = await drawCards(id, 2);
  let blackJack;
  blackJack =
    cards.filter(
      (card) =>
        card.value === "ACE" ||
        card.value === "KING" ||
        card.value === "QUEEN" ||
        card.value === "JACK"
    ).length == 2;
  if (blackJack) {
    return blackJack;
  } else {
    return cards;
  }
}
function blackCheck(person) {
  blackJack =
    person.filter(
      (card) =>
        card.value === "ACE" ||
        card.value === "KING" ||
        card.value === "QUEEN" ||
        card.value === "JACK"
    ).length == 2;
  if (person === true) {
    return true;
  } else {
    return false;
  }
}
let id = await createNewDeck();
let dealer = await dealerHand(id);
let player = await playerHand(id);
let DblackJack = blackCheck(dealer);
let Pblackjack = blackCheck(player);

if (DblackJack) {
} else {
  DOMSelectors.dealer.insertAdjacentHTML(
    "beforeend",
    `<img src="${dealer[0].image}" alt="${dealer[0].value} of ${dealer[0].suit}">
    <img src="backCard.jpeg" alt="back of card">`
  );
}
if (Pblackjack) {
} else {
  DOMSelectors.player.insertAdjacentHTML(
    "beforeend",
    `<img src="${dealer[0].image}" alt="${dealer[0].value} of ${dealer[0].suit}">
    <img src="backCard.jpeg" alt="back of card">`
  );
}
