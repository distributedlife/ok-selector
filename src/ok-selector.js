'use strict';

const BASE = 10;
const DOT = '.';
const ID = ':';
const ALL = '*';
const AllChildren = '*.';

const splitHistory = {};

const isInString = (string, toFind) => string.indexOf(toFind) !== -1;

function splitString (path) {
  if (splitHistory[path] === undefined) {
    splitHistory[path] = path.split(DOT);
  }

  return splitHistory[path];
}

function getFromJSON (node, path) {
  const parts = splitString(path);
  let ref = node;

  for (let i = 0; i < parts.length; i += 1) {
    if (ref[parts[i]] === undefined) {
      return undefined;
    }

    ref = ref[parts[i]];
  }

  return ref;
}

function findObject (node, path, id) {
  const array = getFromJSON(node, path);
  if (!array) {
    return undefined;
  }

  return array.find((element) => element.id === id);
}

function getArrayById (node, key, findNode, read) {
  const path = key.split(ID)[0];
  const suffix = key.split(ID).slice(1).join(ID);

  if (isInString(suffix, DOT)) {
    const id = parseInt(suffix.split(DOT)[0], BASE);
    const subPath = suffix.replace(/^[0-9]+\./, '');

    const child = findNode(node, path, id);
    if (!child) {
      console.warn(`The path reference by ${key} could not be found.`);
      return undefined;
    }
    return read(child, subPath);
  }

  const id = parseInt(suffix, BASE);
  return findNode(node, path, id);
}

let read;
function mapObjectChildren (node, path, suffix) {
  const obj = getFromJSON(node, path);
  if (!obj) {
    return undefined;
  }
  return obj.map((child) => read(child, suffix));
}

function getChildren (node, key, mapChildren) {
  const path = key.split(AllChildren)[0];
  const suffix = key.split(AllChildren)[1];

  return mapChildren(node, path, suffix);
}

read = (node, key) => {
  if (isInString(key, ID)) {
    return getArrayById(node, key, findObject, read);
  } else if (isInString(key, ALL)) {
    return getChildren(node, key, mapObjectChildren);
  }

  return getFromJSON(node, key);
};

export const has = (node, key) => read(node, key) !== undefined;
export const unwrap = (node, key) => read(node, key);

export default read;
