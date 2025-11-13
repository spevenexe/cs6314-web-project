/**
 * This file contains common functions used between multiple components that are NOT related to fetching the Mongo Database.
 */

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