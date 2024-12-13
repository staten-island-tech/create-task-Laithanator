const getData = async () => {
  try {
    const response = await fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    );
    const data = await response.json();
    const id = data.deck_id;
    response = await fetch(
      `https://deckofcardsapi.com/api/deck/${id}/draw/?count=2`
    );
    return response;
  } catch (error) {
    error("error fetching");
  }
};

getData();
