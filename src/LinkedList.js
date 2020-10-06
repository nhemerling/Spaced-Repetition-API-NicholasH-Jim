class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let currentNode = this.head;
      while (currentNode.next !== null) {
        currentNode = currentNode.next;
      }
      currentNode.next = new _Node(item, null);
    }
  }

  insertBefore(item, key) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let currentNode = this.head;
      let previousNode = this.head;
      while (currentNode.value !== key && currentNode !== null) {
        previousNode = currentNode;
        currentNode = currentNode.next;
      }
      if (currentNode === null) {
        console.log("Key not found");
      }
      let newNode = new _Node(item, currentNode);
      previousNode.next = newNode;
    }
  }

  insertAfter(item, key) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let currentNode = this.head;
      while (currentNode.value !== key && currentNode !== null) {
        currentNode = currentNode.next;
      }
      if (currentNode === null) {
        console.log("Key not found");
      }
      let newNode = new _Node(item, currentNode.next);
      currentNode.next = newNode;
    }
  }

  insertAt(item, index) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let currentNode = this.head;
      let previousNode = this.head;
      for (let i = 0; i < index; i++) {
        previousNode = currentNode;
        currentNode = currentNode.next;
        if (currentNode === null) {
          console.log("Index out of range");
        }
      }
      let newNode = new _Node(item, currentNode);
      previousNode.next = newNode;
    }
  }

  find(item) {
    if (this.head === null) {
      return null;
    } else {
      let currentNode = this.head;
      while (currentNode.value !== item) {
        if (currentNode.next === null) {
          return null;
        }
        currentNode = currentNode.next;
      }
      return currentNode;
    }
  }

  remove(item) {
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    } else if (this.head === null) {
      return null;
    } else {
      let currentNode = this.head;
      let previousNode = this.head;
      while (currentNode !== null && currentNode.value !== item) {
        previousNode = currentNode;
        currentNode = currentNode.next;
      }
      if (currentNode === null) {
        throw new Error("Item not found");
      }
      previousNode.next = currentNode.next;
    }
  }
}

module.exports = LinkedList;