"use strict";
// Définir un type pour chaque fruit dans le stock
// Ce type garantit que chaque élément du stock a les propriétés id, name, et quantity.
export interface Fruit {
    id: number;
    name: string;
    quantity: number;
  }
  
  // Mettre à jour le type de fruitsStock avec un tableau de Fruit
  // fruitsStock est encore global, mais il ne sera plus muté directement dans les fonctions.
  export let fruitsStock: Fruit[] = [
    { id: 1, name: "Pomme", quantity: 10 },
    { id: 2, name: "Poire", quantity: 5 },
    { id: 3, name: "Ananas", quantity: 8 }
  ];
  
  /* 
  Définition d'un type pour garantir que chaque élément du stock respecte la structure Fruit.
  Cela permet à TypeScript de s'assurer que chaque fruit possède un id, un name, et une quantity, 
  et aide à éviter les erreurs liées à la structure des objets.
  */
  
  // Fonction utilitaire Either pour gérer les erreurs ou les succès
  // Le type Either permet de retourner soit une erreur Left, soit un succès Right dans les fonctions.
  // Cela permet de gérer les erreurs de manière explicite et de ne pas arrêter l'exécution du programme en cas d'erreur.
  export type Either<L, R> = { type: "Left", value: L } | { type: "Right", value: R };
  export const left = <L, R>(value: L): Either<L, R> => ({ type: "Left", value });
  export const right = <L, R>(value: R): Either<L, R> => ({ type: "Right", value });
  
  /*
  Le type Either permet de retourner soit une erreur Left, soit un succès Right dans les fonctions.
  Pour gérer les erreurs de manière explicite sans interrompre le flux du programme. 
  Les erreurs sont capturées et traitées en dehors de la fonction principale, ce qui la rend plus pure.
  */
  
  // Ajouter des fruits dans le stock de manière fonctionnelle
  // Cette fonction ne mute pas le tableau fruitsStock. Si le fruit existe déjà, la quantité est mise à jour.
  // Sinon, un nouveau fruit est ajouté immuablement.
  export function addFruitToStock(name: string, quantity: number): Either<string, Fruit[]> {
    const existingProduct = fruitsStock.find((p) => p.name === name);
  
    if (existingProduct) {
      // Si le fruit existe déjà, on met à jour immuablement le tableau
      const updatedStock = fruitsStock.map(p =>
        p.name === name ? { ...p, quantity: p.quantity + quantity } : p
      );
      return right(updatedStock);
    } else {
      // Sinon, on ajoute un nouveau fruit sans muter le tableau
      const newFruit: Fruit = { id: fruitsStock.length + 1, name, quantity };
      return right([...fruitsStock, newFruit]);
    }
  }
  
  /*
  addFruitToStock retourne maintenant un nouveau tableau sans muter fruitsStock.
  J'utilise Either pour signaler si l'ajout a été un succès Right ou non. Si
  on voulait éviter les doublons, on pourrait retourner une erreur Left si le fruit existe déjà.
  */
  
  // Supprimer un fruit du stock de manière immuable
  // Cette fonction retourne un tableau sans le fruit supprimé, ou une erreur si le fruit n'existe pas.
  export function deleteFruit(name: string): Either<string, Fruit[]> {
    const fruitExists = fruitsStock.some((p) => p.name === name);
  
    if (!fruitExists) {
      // Si le fruit n'existe pas, on retourne une erreur explicite
      return left(`Fruit ${name} not found in stock`);
    }
  
    // Sinon, on retourne un nouveau tableau sans le fruit
    const updatedStock = fruitsStock.filter((p) => p.name !== name);
    return right(updatedStock);
  }
  
  /*
  deleteFruit ne mute plus directement fruitsStock et retourne un Either pour signaler une erreur 
  en cas d'absence du fruit. Cela permet de gérer cette erreur en dehors de la fonction sans 
  affecter le flux du programme.
  */
  
  // Affiche le stock sans effet secondaire, pas de console.log direct
  // Cette fonction retourne simplement une chaîne de caractères représentant l'état du stock.
  export function showStock(): string {
    return fruitsStock
      .map(fruit => `Fruit: ${fruit.name} | Quantity: ${fruit.quantity}`)
      .join("\n");
  }
  
  /*
  showStock ne fait plus de console.log, elle retourne simplement une chaîne de caractères 
  représentant l'état du stock. Cela rend la fonction pure. Le code appelant décide comment 
  afficher ou utiliser cette chaîne, ce qui rend cette fonction plus flexible.
  */
  
  // Vendre un fruit immuablement
  // Cette fonction vérifie si le fruit existe et si la quantité demandée est disponible. 
  // Si oui, elle retourne un tableau avec la quantité mise à jour. Sinon, elle retourne une erreur.
  export function sellFruit(name: string, quantity: number): Either<string, Fruit[]> {
    const fruit = fruitsStock.find((p) => p.name === name);
  
    if (!fruit) {
      return left(`Unknown fruit: ${name}`);
    }
  
    if (fruit.quantity < quantity) {
      return left(`Not enough ${name} in stock`);
    }
  
    // Retourner un nouveau tableau avec la quantité modifiée
    const updatedStock = fruitsStock.map(p =>
      p.name === name ? { ...p, quantity: p.quantity - quantity } : p
    );
  
    return right(updatedStock);
  }
  
  /*
  sellFruit ne mute plus directement fruit.quantity, elle retourne un tableau mis à jour de manière immuable.
  Je gère les erreurs via Either, retournant une erreur si le fruit est inconnu ou si la quantité demandée 
  dépasse le stock. Ce qui permet de capturer ces erreurs dans un pipeline fonctionnel.
  */
  
  // Fonction pour traiter le résult Either
  // Cette fonction met à jour fruitsStock uniquement si le résultat est un succès Right. 
  // Si le résultat est une erreur Left, elle affiche l'erreur.
  export function processResult<L, R>(result: Either<L, R>): void {
    if (result.type === "Left") {
      // Gestion explicite des erreurs
      console.log("Error:", result.value); 
    } else {
      // Mise à jour du stock uniquement si succès
      fruitsStock = result.value as Fruit[];
    }
  }
  
  /*
  processResult est une fonction utilitaire pour gérer les Either. 
  Elle met à jour fruitsStock uniquement en cas de succès Right. En cas d'erreur Left, 
  elle affiche un message d'erreur. Cette approche sépare la logique métier du traitement des erreurs.
  */
  
  // Appels de fonctions refactorisés
  // processResult pour gérer le succès ou l'erreur de chaque opération sur le stock.
  processResult(addFruitToStock("Pomme", 5));  
  processResult(addFruitToStock("Citron", 10)); 
  processResult(sellFruit("Ananas", 2)); 
  
  console.log(showStock()); 
  
  processResult(deleteFruit("Ananas")); 
  
  console.log(showStock()); 
  /*
  Toutes les fonctions retournent maintenant des résultats explicites either.
  Le stock n'est mis à jour que si les fonctions réussissent grâce à Either.
  Les logs sont toujours présents, mais ils ne sont plus dans les fonctions principales, 
  ce qui réduit les effets secondaires et permet une meilleure gestion fonctionnelle.
  */
  
  