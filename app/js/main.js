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
function displayCards(person, dom) {
  dom.innerHTML = "";
  if (dom === DOMSelectors.dealer) {
    dom.insertAdjacentHTML(
      "beforeend",
      `<img src="${person[0].image}" alt="${person[0].value} of ${person[0].suit}">
      <img src="backCard.jpeg" alt="back of card">`
    );
  } else {
    for (let i = 0; i < person.length; i++) {
      dom.insertAdjacentHTML(
        "beforeend",
        `<img src="${person[i].image}" alt="${person[i].value} of ${person[i].suit}">`
      );
    }
  }
}
async function newCard(id) {
  let pull = await drawCards(id, 1);
  let card = pull[0];
  return card;
}
function bust(person) {
  let total = 0;
  for (let i = 0; i < person.length; i++) {
    total += person[i].value;
  }
  if (total > 21) {
    return true;
  } else {
    return false;
  }
}
let id = await createNewDeck();
let dealer = await createHand(id);
let player = await createHand(id);
displayCards(dealer, DOMSelectors.dealer);
displayCards(player, DOMSelectors.player);
if (!blackCheck(dealer)) {
  DOMSelectors.buttons.insertAdjacentHTML(
    "beforeend",
    `<button id="hit">Hit</button>
    <button id="stand">Stand</button>
    <button id="double">Double</button>`
  );
  let hitBtn = document.querySelector("#hit");
  let standBtn = document.querySelector("#stand");
  hitBtn.replaceWith(hitBtn.cloneNode(true));
  standBtn.replaceWith(standBtn.cloneNode(true));
  hitBtn = document.querySelector("#hit");
  standBtn = document.querySelector("#stand");
  hitBtn.addEventListener("click", async () => {
    player.push(await newCard(id));
    displayCards(player, DOMSelectors.player);
    if (bust(player)) {
      DOMSelectors.buttons.innerHTML = "";
    }
  });
}
