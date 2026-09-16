import chalk from 'chalk'
import type { Item, Store } from './store.js'

function fmtTag(t: string) {
  return chalk.hex('#7c6af7')(`#${t}`)
}

function fmtId(id: number) {
  return chalk.dim(`${String(id).padStart(3)}`)
}

function fmtText(item: Item) {
  const text = item.done ? chalk.dim(chalk.strikethrough(item.text)) : item.text
  const tags = item.tags.map(fmtTag).join(' ')
  return tags ? `${text}  ${tags}` : text
}

export function printItem(item: Item) {
  const mark = item.done ? chalk.green('✓') : chalk.dim('·')
  console.log(`  ${fmtId(item.id)}  ${mark}  ${fmtText(item)}`)
}

export function printList(items: Item[], title?: string) {
  if (title) console.log(`\n${chalk.bold.white('  ' + title)}\n`)
  if (items.length === 0) {
    console.log(chalk.dim('  nothing here'))
    return
  }
  items.forEach(printItem)
}

export function printSummary(store: Store) {
  const total = store.items.length
  const done  = store.items.filter(i => i.done).length
  const open  = total - done
  if (total === 0) { console.log(chalk.dim('  empty')); return }

  const bar = buildBar(done, total, 24)
  console.log(`\n  ${chalk.green(String(done))}/${total}  ${bar}  ${chalk.dim(String(open) + ' left')}`)
}

function buildBar(n: number, total: number, width: number): string {
  const filled = Math.round((n / total) * width)
  return chalk.green('█'.repeat(filled)) + chalk.dim('░'.repeat(width - filled))
}

export function ok(msg: string) {
  console.log(`  ${chalk.green('✓')}  ${msg}`)
}

export function err(msg: string) {
  console.error(`  ${chalk.red('!')}  ${msg}`)
}
