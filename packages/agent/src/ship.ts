export enum ShipDirection {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical",
}

export type Ship = {
    origin: string;
    direction: ShipDirection;
    length: number;
    hits: number[];
};

const indexToLabel = (n: number): string => {
    if (n < 26) {
        return String.fromCharCode(65 + n);
    }
    return (
        indexToLabel(Math.floor((n - 26) / 26)) +
        String.fromCharCode(65 + ((n - 26) % 26))
    );
};

const labelToIndex = (label: string): number => {
    let result = 0;
    for (let i = 0; i < label.length; i++) {
        result = result * 26 + (label.charCodeAt(i) - 65 + 1);
    }
    return result - 1;
};

const parseCoord = (coord: string): { col: number; row: number } => {
    const match = coord.match(/^([A-Z]+)(\d+)$/)!;
    return { col: labelToIndex(match[1]), row: parseInt(match[2], 10) - 1 };
};

export const initShip = (
    origin: string,
    direction: ShipDirection,
    length: number,
): Ship => ({
    origin,
    direction,
    length,
    hits: [],
});

export const shipCoords = (ship: Ship): string[] => {
    const { col, row } = parseCoord(ship.origin);
    return Array.from({ length: ship.length }, (_, i) =>
        ship.direction === ShipDirection.HORIZONTAL
            ? `${indexToLabel(col + i)}${row + 1}`
            : `${indexToLabel(col)}${row + i + 1}`,
    );
};

export const shipHit = (ship: Ship, deckIndex: number): void => {
    if (!ship.hits.includes(deckIndex)) {
        ship.hits.push(deckIndex);
    }
};

export const shipIsSunk = (ship: Ship): boolean =>
    ship.hits.length >= ship.length;
