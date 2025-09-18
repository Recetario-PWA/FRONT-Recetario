import { inject, signal } from '@angular/core';

const STORAGE_KEY = 'favorites';

function loadFavs(): number[] {
  const json = localStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

const favList = signal<number[]>(loadFavs());

function saveFavorite(recipe: number[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipe));
}

export function addTofavList(id: number) {
  favList.update(current => {
    if (current.includes(id)) return current;
    const updated = [...current, id];
    saveFavorite(updated);
    return updated;
  });
}

export function removeFromfavList(id: number) {
  favList.update(current => {
    const updated = current.filter(item => item !== id);
    saveFavorite(updated);
    return updated;
  });
}

export function clearfavList() {
  favList.set([]);
  localStorage.removeItem(STORAGE_KEY);
}

export function usefavList() {
  return favList;
}