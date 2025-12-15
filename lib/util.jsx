/**
 * This file contains common functions used between multiple components that are NOT related to fetching the Mongo Database.
 */
import React from "react";
import { Link } from "react-router-dom";

// enum for page types
export class PageType {
  static get COMMENT() {
    return "comment";
  }
  static get DETAIL() {
    return "detail";
  }
  static get PHOTO() {
    return "photo";
  }
  static get FAVORITE() {
    return "favorite";
  }
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

/**
 * Parse @mentions in the comment into two different arrays of matches and non matches
 * @param {string} comment
 * @returns
 */
export function getCommentMatches(comment) {
  const regex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  const matches = comment.matchAll(regex);

  const regex2 = /@\[[^\]]+\]\([^)]+\)/;
  const nonMatches = comment.split(regex2);

  // convert to array
  const arrMatches = [];
  for (const match of matches) {
    arrMatches.push(match);
  }

  return [arrMatches, nonMatches];
}

/**
 * Convert a list of mentions and string partitions into a singular array JSX fragment
 * @param {Array} matches 
 * @param {Array} nonMatches 
 * @param {boolean} isLink whether to embed links in the resulting JSX
 */
export function createCommentWithMentions(matches, nonMatches, isLink = true) {
  const arrMatches = [];
  for (const match of matches) {
    const formattedMention = `${match[1]}`;
    if (isLink) arrMatches.push(<Link key={match.index} to={`/users/${match[2]}`}>{formattedMention}</Link>);
    else arrMatches.push(<b to={`/users/${match[2]}`}>{formattedMention}</b>);
  }

  const formattedComment = [nonMatches[0]];
  for (let i = 0; i < arrMatches.length; ++i) {
    formattedComment.push(arrMatches[i]);
    formattedComment.push(nonMatches[i + 1]);
  }

  return formattedComment;
}
