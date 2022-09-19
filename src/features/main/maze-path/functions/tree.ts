import { Point } from '../../../../shared/types';
import { Cell } from '../cell';
import { MazeDigger } from '../maze-digger';
import { Node } from '../types';
import { getCell } from './helpers';

export const nodeId = (point: Point) => `x${point.x}y${point.y}`;

export function addNodeToTree(
  nodeToAdd: Node,
  nextSelectedNode: Node,
  nodeTree: Node[],
  setNodeTree: any[],
  mazePathCancel: boolean
) {
  if (!nodeTree.length) {
    nodeTree = [addNextNodeAsChildOnCurrentNode(nodeToAdd, nextSelectedNode)];
    return;
  }

  nodeTree = nodeTree.map((treeNode) => {
    return addNodeRecursive(
      treeNode,
      nodeToAdd,
      nextSelectedNode,
      mazePathCancel
    );
  });
}

export function dig(
  x: number,
  y: number,
  digger: MazeDigger,
  grid: Cell[],
  gridSize: number,
  currentPath: Point[],
  nodeTree: Node[],
  setNodeTree: any,
  digAll: boolean,
  digSpeed: number,
  mazeFinished: boolean,
  mazePathCancel: boolean
) {
  if (!digger) {
    digger = new MazeDigger(x, y);
  } else {
    digger.setCurrentPosition(x, y);
  }

  const currentCell = getCell(x, y, grid, gridSize);
  if (!currentCell.visited) {
    currentPath = [...currentPath, { x, y }];
    currentCell.visited = true;
  }

  const nodeWithSelectedChild = digger.getNodeWithSelectedChild(grid, gridSize);
  if (nodeWithSelectedChild) {
    const { node, possibleChildren, nextX, nextY } = nodeWithSelectedChild;
    const nextNode = { x: nextX, y: nextY };
    if (possibleChildren) {
      addNodeToTree(node, nextNode, nodeTree, setNodeTree, mazePathCancel);
      if (digAll) {
        setTimeout(() => {
          dig(
            nextX,
            nextY,
            digger,
            grid,
            gridSize,
            currentPath,
            nodeTree,
            setNodeTree,
            digAll,
            digSpeed,
            mazeFinished,
            mazePathCancel
          );
        }, digSpeed);
      }
    } else {
      if (currentPath.length) {
        digger.backtrack(
          currentPath,
          mazeFinished,
          grid,
          gridSize,
          nodeTree,
          setNodeTree,
          digAll,
          digSpeed,
          mazePathCancel
        );
      }
    }
  }
}

export function addNodeRecursive(
  treeNode: Node,
  nodeToAdd: Node,
  nextSelectedNode: Node,
  mazePathCancel: boolean
): Node {
  if (isNode(treeNode, nodeToAdd) && !mazePathCancel) {
    return addNextNodeAsChildOnCurrentNode(treeNode, nextSelectedNode);
  } else {
    return {
      ...treeNode,
      children: treeNode.children?.map((treeNodeChild) =>
        addNodeRecursive(
          treeNodeChild,
          nodeToAdd,
          nextSelectedNode,
          mazePathCancel
        )
      ),
    };
  }
}

export const isNode = (n1: Node, n2: Node) => n1.x === n2.x && n1.y === n2.y;

export function addNextNodeAsChildOnCurrentNode(
  currentNode: Node,
  nextNode: Node
) {
  if (!currentNode.id) {
    currentNode.id = nodeId({ x: currentNode.x, y: currentNode.y });
  }
  const updatedNextNode = {
    ...nextNode,
    id: nodeId({ x: nextNode.x, y: nextNode.y }),
    parent: { x: currentNode.x, y: currentNode.y },
    children: [],
  };
  return {
    ...currentNode,
    children: [...currentNode.children!, updatedNextNode],
  };
}
