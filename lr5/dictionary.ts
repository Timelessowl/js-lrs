type DictionaryNode = {
  prefix: string;
  wordEnds: Set<number>;
  children: Map<number, DictionaryNode>;
};

export class Dictionary {
  private root: DictionaryNode = {
    prefix: "",
    wordEnds: new Set(),
    children: new Map(),
  };

  addWords(words: string[]): void {
    words.forEach((word) => this.addWord(word));
  }

  addWord(word: string): void {
    let currentNode = this.root;
    let wordIndex = 0;
    while (wordIndex < word.length) {
      const characterCode = word.charCodeAt(wordIndex);
      const childNode = currentNode.children.get(characterCode);
      if (!childNode) {
        const newNode = this.createNode(word.slice(wordIndex));
        newNode.wordEnds.add(newNode.prefix.length);
        currentNode.children.set(characterCode, newNode);
        return;
      }

      const prefixLength = this.matchPrefix(childNode.prefix, word, wordIndex);
      wordIndex += prefixLength;
      if (wordIndex === word.length) {
        childNode.wordEnds.add(prefixLength);
        return;
      }
      if (prefixLength < childNode.prefix.length) {
        this.splitNode(childNode, prefixLength);
      } else if (childNode.children.size === 0) {
        childNode.prefix += word.slice(wordIndex);
        childNode.wordEnds.add(childNode.prefix.length);
        return;
      }
      currentNode = childNode;
    }
    currentNode.wordEnds.add(0);
  }

  hasWord(word: string): boolean {
    let currentNode = this.root;
    let wordIndex = 0;
    while (wordIndex < word.length) {
      const childNode = currentNode.children.get(word.charCodeAt(wordIndex));
      if (!childNode) return false;
      const prefixLength = this.matchPrefix(childNode.prefix, word, wordIndex);
      wordIndex += prefixLength;
      if (wordIndex === word.length)
        return childNode.wordEnds.has(prefixLength);
      if (prefixLength < childNode.prefix.length) return false;
      currentNode = childNode;
    }
    return currentNode.wordEnds.has(0);
  }

  private createNode(prefix: string): DictionaryNode {
    return { prefix, wordEnds: new Set(), children: new Map() };
  }

  private matchPrefix(prefix: string, word: string, wordIndex: number): number {
    let prefixLength = 0;
    while (
      prefixLength < prefix.length &&
      prefix[prefixLength] === word[wordIndex + prefixLength]
    ) {
      prefixLength++;
    }
    return prefixLength;
  }

  private splitNode(node: DictionaryNode, prefixLength: number): void {
    const childNode = this.createNode(node.prefix.slice(prefixLength));
    childNode.children = node.children;
    for (const wordEnd of node.wordEnds) {
      if (wordEnd > prefixLength) {
        childNode.wordEnds.add(wordEnd - prefixLength);
        node.wordEnds.delete(wordEnd);
      }
    }
    node.prefix = node.prefix.slice(0, prefixLength);
    node.children = new Map([[childNode.prefix.charCodeAt(0), childNode]]);
  }
}
