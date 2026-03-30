import { type CollectionEntry } from "astro:content";

// sort by date
export const sortByDate = (array: CollectionEntry<"posts">[]) => {
  const sortedArray = array.sort(
    (a: CollectionEntry<"posts">, b: CollectionEntry<"posts">) =>
      new Date(b.data.date && b.data.date).getTime() -
      new Date(a.data.date && a.data.date).getTime(),
  );
  return sortedArray;
};
