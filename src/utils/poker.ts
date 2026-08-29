const suits = ['s', 'h', 'd', 'c'];
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

export const getDeck = () => {
  const deck: string[] = [];
  for (const r of ranks) for (const s of suits) deck.push(`${r}${s}`);
  return deck;
};

export const shuffle = (array: string[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// ZBALANSOWANE SCENARIUSZE (50% Atak, 50% Obrona)
export const generateRandomScenario = () => {
  const deck = shuffle(getDeck());
  const hand = [deck.pop()!, deck.pop()!].join('');
  const streets = [0, 3, 4, 5]; // 0 = preflop, 3 = flop, etc.
  const cardsToDraw = streets[Math.floor(Math.random() * streets.length)];
  const board = [];

  for (let i = 0; i < cardsToDraw; i++) board.push(deck.pop()!);

  let spot;

  if (cardsToDraw === 0) {
    // === SCENARIUSZE PREFLOP ===
    const preflopSpots = [
      // Atak
      { title: "BTN Otwiera (Hero: BTN)", initialPot: 1.5, stack: 100, hero: "BTN", villain: "BB", history: "", toCall: "0.0" },
      // Obrona (Mamy do sprawdzenia przebicie)
      { title: "Obrona BB vs BTN Open", initialPot: 3.5, stack: 100, hero: "BB", villain: "BTN", history: "R", toCall: "2.0" },
      { title: "BTN vs 3-Bet z SB", initialPot: 10.5, stack: 100, hero: "BTN", villain: "SB", history: "RR", toCall: "7.0" }
    ];
    spot = preflopSpots[Math.floor(Math.random() * preflopSpots.length)];
  } else {
    // === SCENARIUSZE POSTFLOP ===
    const postflopSpots = [
      // ATAK (Inicjatywa jest po naszej stronie, nikt nie postawił - akcje: CHECK / BET)
      { title: "BTN vs BB, SRP (In Position)", initialPot: 5.5, stack: 100, hero: "BTN", villain: "BB", history: "C", toCall: "0.0" },
      { title: "SB vs BB, 3-Bet Pot (Out of Position)", initialPot: 21.0, stack: 100, hero: "SB", villain: "BB", history: "", toCall: "0.0" },

      // OBRONA (Przeciwnik postawił zakład, my się bronimy! - akcje: FOLD / CALL / RAISE)
      { title: "BB vs BTN, SRP (Facing C-Bet)", initialPot: 5.5, stack: 100, hero: "BB", villain: "BTN", history: "CB", toCall: "1.8" },
      { title: "BTN vs CO, 3-Bet Pot (Facing C-Bet)", initialPot: 18.5, stack: 100, hero: "BTN", villain: "CO", history: "CB", toCall: "6.0" },
      { title: "BTN vs BB, SRP (Facing Donk Bet)", initialPot: 5.5, stack: 100, hero: "BTN", villain: "BB", history: "B", toCall: "2.5" }
    ];
    spot = postflopSpots[Math.floor(Math.random() * postflopSpots.length)];
  }

  let currentPot = spot.initialPot;
  // Zwiększamy pulę dla późniejszych faz, żeby zachować realizm poprzednich ulic
  if (cardsToDraw === 4) currentPot += Math.floor(Math.random() * 10) + 5;
  if (cardsToDraw === 5) currentPot += Math.floor(Math.random() * 30) + 15;

  return {
    hand, board: board.join(''), pos: spot.hero, villainPos: spot.villain,
    history: spot.history, spotTitle: spot.title, stack: spot.stack,
    pot: currentPot.toFixed(1), toCall: spot.toCall
  };
};

export const parseScenario = (scenarioObj: any) => {
  if (!scenarioObj) return null;
  const { hand: handStr, board: boardStr, pos, pot: scenarioPot, toCall: scenarioToCall } = scenarioObj;

  const safeHand = handStr || "";
  const hand = [safeHand.slice(0, 2), safeHand.slice(2, 4)].filter(c => c.length === 2);
  const board = [];

  const safeBoard = boardStr || "";
  for (let i = 0; i < safeBoard.length; i += 2) {
    if (i + 1 < safeBoard.length) board.push(safeBoard.slice(i, i + 2));
  }

  const isPreflop = board.length === 0;
  const isFlop = board.length === 3;
  const isTurn = board.length === 4;
  const isRiver = board.length === 5;

  let streetName = "Preflop";
  if (isFlop) streetName = "Flop";
  if (isTurn) streetName = "Turn";
  if (isRiver) streetName = "River";

  const pot = scenarioPot ? parseFloat(scenarioPot) : 1.5;

  // TO JEST KLUCZ: Wciągamy informację o tym, czy musimy dopłacać, prosto ze scenariusza
  const toCall = scenarioToCall || "0.0";

  return {
    ...scenarioObj, board, street: streetName, hand, position: pos,
    pot: pot.toFixed(1), toCall, smallRaiseTarget: (pot * 0.33).toFixed(1), bigRaiseTarget: (pot * 0.75).toFixed(1)
  };
};
