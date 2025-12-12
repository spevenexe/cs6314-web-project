/**
 * This file contains common functions used between multiple components that are NOT related to fetching the Mongo Database.
 */

// enum for page types 
export class PageType {
  static get COMMENT() { return 'comment'; }
  static get DETAIL() { return 'detail'; }
  static get PHOTO() { return 'photo'; }
}

/**
 *
 * @param {string} date_time a parseable date format string
 * @returns {string} a user-readable date
 */
export default function formatDate(date_time) {
  const date = new Date(date_time);

  const formattedDate = date.toLocaleString("default", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return formattedDate;
}

export function parseComment(comment) {
  // const regex = `@\\[[^\\]]+\\]\\([^\\)]+\\)`;
  const regex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  const matches = comment.matchAll(regex);
  const regex2 = /@\[[^\]]+\]\([^)]+\)/;
  const nonMatches = comment.split(regex2);
  console.log(nonMatches);
  const arrMatches = [];
  for (const match of matches) {
    arrMatches.push(match);
  }

  return [arrMatches, nonMatches];
}