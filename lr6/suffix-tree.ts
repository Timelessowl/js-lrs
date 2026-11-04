type SuffixNode = {
  start: number;
  end: number;
  children: Map<string, SuffixNode>;
};

export class SuffixTree {
  private characters: string[];
  private root: SuffixNode = this.createNode(0, 0);

  constructor(value: string | string[]) {
    this.characters = [...value, "$"];
    for (let start = 0; start < this.characters.length; start++) {
      this.addSuffix(start);
    }
  }

  hasSubstring(value: string): boolean {
    const characters = Array.from(value);
    let currentNode = this.root;
    let index = 0;
    while (index < characters.length) {
      const childNode = currentNode.children.get(characters[index]);
      if (!childNode) return false;

      for (
        let edgeIndex = childNode.start;
        edgeIndex < childNode.end;
        edgeIndex++
      ) {
        if (index === characters.length) return true;
        if (this.characters[edgeIndex] !== characters[index]) return false;
        index++;
      }
      currentNode = childNode;
    }
    return true;
  }

  commonPrefixLength(first: number, second: number): number {
    const length = this.characters.length - 1;
    if (first < 0 || second < 0 || first >= length || second >= length)
      return 0;

    let currentNode = this.root;
    let result = 0;
    while (first + result < length && second + result < length) {
      const character = this.characters[first + result];
      if (character !== this.characters[second + result]) break;

      const childNode = currentNode.children.get(character)!;
      result += Math.min(
        childNode.end - childNode.start,
        length - first - result,
        length - second - result,
      );
      currentNode = childNode;
    }
    return result;
  }

  private createNode(start: number, end: number): SuffixNode {
    return { start, end, children: new Map() };
  }

  private addSuffix(start: number): void {
    let currentNode = this.root;
    let index = start;
    while (index < this.characters.length) {
      const character = this.characters[index];
      const childNode = currentNode.children.get(character);
      if (!childNode) {
        currentNode.children.set(
          character,
          this.createNode(index, this.characters.length),
        );
        return;
      }

      let prefixLength = 0;
      while (
        childNode.start + prefixLength < childNode.end &&
        this.characters[childNode.start + prefixLength] ===
          this.characters[index + prefixLength]
      ) {
        prefixLength++;
      }
      index += prefixLength;
      if (childNode.start + prefixLength === childNode.end) {
        currentNode = childNode;
        continue;
      }

      const splitNode = this.createNode(
        childNode.start,
        childNode.start + prefixLength,
      );
      childNode.start += prefixLength;
      splitNode.children.set(this.characters[childNode.start], childNode);
      splitNode.children.set(
        this.characters[index],
        this.createNode(index, this.characters.length),
      );
      currentNode.children.set(character, splitNode);
      return;
    }
  }
}
