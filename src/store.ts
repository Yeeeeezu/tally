import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

export interface Item {
  id:      number
  text:    string
  done:    boolean
  created: string
  tags:    string[]
}

export interface Store {
  items:  Item[]
  nextId: number
}

function storePath(): string {
  const dir = join(homedir(), '.tally')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return join(dir, 'store.json')
}

export function load(): Store {
  const p = storePath()
  if (!existsSync(p)) return { items: [], nextId: 1 }
  try {
    return JSON.parse(readFileSync(p, 'utf8')) as Store
  } catch {
    return { items: [], nextId: 1 }
  }
}

export function save(store: Store): void {
  writeFileSync(storePath(), JSON.stringify(store, null, 2))
}

export function add(store: Store, text: string, tags: string[]): Item {
  const item: Item = {
    id:      store.nextId++,
    text,
    done:    false,
    created: new Date().toISOString(),
    tags,
  }
  store.items.push(item)
  return item
}

export function check(store: Store, ids: number[]): number[] {
  const done: number[] = []
  for (const id of ids) {
    const item = store.items.find(i => i.id === id)
    if (item && !item.done) { item.done = true; done.push(id) }
  }
  return done
}

export function uncheck(store: Store, ids: number[]): number[] {
  const undone: number[] = []
  for (const id of ids) {
    const item = store.items.find(i => i.id === id)
    if (item && item.done) { item.done = false; undone.push(id) }
  }
  return undone
}

export function remove(store: Store, ids: number[]): number {
  const before = store.items.length
  store.items = store.items.filter(i => !ids.includes(i.id))
  return before - store.items.length
}

export function clean(store: Store): number {
  const before = store.items.length
  store.items = store.items.filter(i => !i.done)
  return before - store.items.length
}

export function filter(store: Store, opts: { done?: boolean; tag?: string }): Item[] {
  return store.items.filter(i => {
    if (opts.done !== undefined && i.done !== opts.done) return false
    if (opts.tag && !i.tags.includes(opts.tag)) return false
    return true
  })
}
