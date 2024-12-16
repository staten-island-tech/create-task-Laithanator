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
    return await response.json();
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
  for (let i = 0; i < cards.length; i++)
    (cards) => {
      cards[i].value == "ACE" ||
      cards[i].value == "KING" ||
      cards[i].value == "QUEEN" ||
      cards[i].value == "JACK"
        ? (blackJack = true)
        : (blackjack = false);
    };
  return blackJack;
}
console.log(await dealerHand("i1y36ts23k8g"));
