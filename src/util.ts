export function shuffle<T>(array: T[]): T[] {
    const available = array.slice(0, array.length)
    const res: T[] = []

    while (available.length > 0) {
        const i = Math.floor(Math.random() * available.length)
        res.push(available[i])
        available.splice(i, 1)
    }

    return res
}
