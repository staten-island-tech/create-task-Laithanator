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
async function newGame() {
  const id = await createNewDeck();
  const dealer = await dealerHand();
  const player = [];
}
async function dealerHand(id) {
  const cards = await drawCards(id, 2);
  return cards;
}
async function playerHand(id) {
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
function displayCards(person, dom) {
  if (dom === DOMSelectors.dealer) {
    dom.insertAdjacentHTML(
      "beforeend",
      `<img src="${person[0].image}" alt="${person[0].value} of ${person[0].suit}">
      <img src="backCard.jpeg" alt="back of card">`
    );
  } else {
    dom.insertAdjacentHTML(
      "beforeend",
      `<img src="${person[0].image}" alt="${person[0].value} of ${person[0].suit}">
      <img src="${person[1].image}" alt="${person[1].value} of ${person[1].suit}">`
    );
  }
}

let id = await createNewDeck();
let dealer = await dealerHand(id);
let player = await playerHand(id);
displayCards(dealer, DOMSelectors.dealer);
displayCards(player, DOMSelectors.player);
if (!blackCheck(dealer)) {
  DOMSelectors.buttons.insertAdjacentHTML(
    "beforeend",
    `<button id="hit">Hit</button>
    <button id="stand">Stand</button>
    <button id="double">Double</button>`
  );
  let Mbtn = document.querySelector("#Mbtn");
  let Lbtn = document.querySelector("#Lbtn");
  Mbtn.replaceWith(Mbtn.cloneNode(true));
  Lbtn.replaceWith(Lbtn.cloneNode(true));
  Mbtn = document.querySelector("#Mbtn");
  Lbtn = document.querySelector("#Lbtn");
  Mbtn.addEventListener("click", () => {
}
