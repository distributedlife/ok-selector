'use strict';

import { Map, List } from 'immutable';

const BASE = 10;
const DOT = '.';
const ID = ':';
const ALL = '*';
const AllChildren = '*.';

const splitHistory = {};

const isInString = (string, toFind) => string.indexOf(toFind) !== -1;
const isImmutable = (node) => Map.isMap(node) || List.isList(node);

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

function getFromImmutable (node, path) {
  return node !== undefined ? node.getIn(splitString(path)) : node;
}

function findObject (node, path, id) {
  return getFromJSON(node, path).find((element) => element.id === id);
}

function findImmutable (node, path, id) {
  return getFromImmutable(node, path).find((x) => x.get('id') === id);
}

function getArrayById (node, key, findNode, read) {
  const path = key.split(ID)[0];
  const suffix = key.split(ID).slice(1).join(ID);

  if (isInString(suffix, DOT)) {
    const id = parseInt(suffix.split(DOT)[0], BASE);
    const subPath = suffix.replace(/^[0-9]+\./, '');

    const child = findNode(node, path, id);
    return read(child, subPath);
  }

  const id = parseInt(suffix, BASE);
  return findNode(node, path, id);
}

let readFromImmutable;
let readFromJSON;
function mapObjectChildren (node, path, suffix) {
  return getFromJSON(node, path).map((child) => readFromJSON(child, suffix));
}

function mapImmutableChildren (node, path, suffix) {
  return getFromImmutable(node, path).map((child) => readFromImmutable(child, suffix));
}

function getChildren (node, key, mapChildren) {
  const path = key.split(AllChildren)[0];
  const suffix = key.split(AllChildren)[1];

  return mapChildren(node, path, suffix);
}

readFromJSON = (node, key) => {
  if (isInString(key, ID)) {
    return getArrayById(node, key, findObject, readFromJSON);
  } else if (isInString(key, ALL)) {
    return getChildren(node, key, mapObjectChildren);
  }

  return getFromJSON(node, key);
};

readFromImmutable = (node, key) => {
  if (isInString(key, ID)) {
    return getArrayById(node, key, findImmutable, readFromImmutable);
  } else if (isInString(key, ALL)) {
    return getChildren(node, key, mapImmutableChildren);
  }

  return getFromImmutable(node, key);
};

export default function read (node, key) {
  return isImmutable(node) ? readFromImmutable(node, key) : readFromJSON(node, key);
}

export const unwrap = (node, key) => {
  const value = read(node, key);
  return isImmutable(value) ? value.toJS() : value;
}