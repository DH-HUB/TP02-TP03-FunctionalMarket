import { Either, left, right, addFruitToStock, deleteFruit, sellFruit, showStock, Fruit, fruitsStock, processResult } from './functional-market-correctif';

let mockFruitsStock: Fruit[] = [
  { id: 1, name: "Pomme", quantity: 10 },
  { id: 2, name: "Poire", quantity: 5 },
  { id: 3, name: "Ananas", quantity: 8 }
];


function processTestResult<L, R>(result: Either<L, R>): R | L {
  return result.type === "Right" ? result.value : result.value;
}

// Hook pour réinitialiser `fruitsStock` avant chaque test
beforeEach(() => {
  // Réinitialiser le stock initial avant chaque test
  fruitsStock.length = 0;
  fruitsStock.push(...mockFruitsStock);
});

// Test de `addFruitToStock`
describe("addFruitToStock", () => {
  it("devrait ajouter un nouveau fruit au stock", () => {
    const result = addFruitToStock("Citron", 10);
    const stock = processTestResult(result);
    
    expect(stock).toEqual([
      ...mockFruitsStock,
      { id: 4, name: "Citron", quantity: 10 }
    ]);
  });

  it("devrait augmenter la quantité si le fruit existe déjà", () => {
    const result = addFruitToStock("Pomme", 5);
    const stock = processTestResult(result);

    expect(stock).toEqual([
      { id: 1, name: "Pomme", quantity: 15 },
      { id: 2, name: "Poire", quantity: 5 },
      { id: 3, name: "Ananas", quantity: 8 }
    ]);
  });
});


describe("deleteFruit", () => {
  it("devrait supprimer un fruit existant", () => {
    const result = deleteFruit("Ananas");
    const stock = processTestResult(result);

    expect(stock).toEqual([
      { id: 1, name: "Pomme", quantity: 10 },
      { id: 2, name: "Poire", quantity: 5 }
    ]);
  });

  it("devrait retourner une erreur si le fruit n'existe pas", () => {
    const result = deleteFruit("Mangue");

    expect(result).toEqual(left("Fruit Mangue not found in stock"));
  });
});


describe("sellFruit", () => {
  it("devrait diminuer la quantité de fruits correctement", () => {
    const result = sellFruit("Pomme", 5);
    const stock = processTestResult(result);

    expect(stock).toEqual([
      { id: 1, name: "Pomme", quantity: 5 },
      { id: 2, name: "Poire", quantity: 5 },
      { id: 3, name: "Ananas", quantity: 8 }
    ]);
  });

  it("devrait retourner une erreur si la quantité demandée dépasse le stock", () => {
    const result = sellFruit("Poire", 10);

    expect(result).toEqual(left("Not enough Poire in stock"));
  });

  it("devrait retourner une erreur si le fruit n'existe pas", () => {
    const result = sellFruit("Mangue", 2);

    expect(result).toEqual(left("Unknown fruit: Mangue"));
  });
});


describe("showStock", () => {
  it("devrait afficher correctement le stock actuel", () => {
    const stockString = showStock();

    expect(stockString).toBe(
      "Fruit: Pomme | Quantity: 10\nFruit: Poire | Quantity: 5\nFruit: Ananas | Quantity: 8"
    );
  });
});
