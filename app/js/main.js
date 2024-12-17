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
let id = await createNewDeck();
let testDeal = await dealerHand(id);
let DblackJack = false;
if (testDeal === true) {
  DblackJack = true;
}
if (DblackJack === true) {
  console.log(DblackJack);
}
