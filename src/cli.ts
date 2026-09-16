#!/usr/bin/env node
import { program } from 'commander'
import { load, save, add, check, uncheck, remove, clean, filter } from './store.js'
import { printList, printSummary, ok, err } from './display.js'

program
  .name('tally')
  .description('terminal todo tracker')
  .version('0.1.0')

program
  .command('add <text>')
  .description('add a new item')
  .option('-t, --tag <tags...>', 'tags')
  .action((text: string, opts: { tag?: string[] }) => {
    const store = load()
    const item  = add(store, text, opts.tag ?? [])
    save(store)
    ok(`added #${item.id}`)
  })

program
  .command('check <ids...>')
  .description('mark items done')
  .action((ids: string[]) => {
    const store = load()
    const done  = check(store, ids.map(Number))
    save(store)
    if (done.length) ok(`checked ${done.join(', ')}`)
    else err('nothing to check')
  })

program
  .command('uncheck <ids...>')
  .description('mark items not done')
  .action((ids: string[]) => {
    const store = load()
    const undone = uncheck(store, ids.map(Number))
    save(store)
    if (undone.length) ok(`unchecked ${undone.join(', ')}`)
    else err('nothing to uncheck')
  })

program
  .command('rm <ids...>')
  .description('remove items')
  .action((ids: string[]) => {
    const store = load()
    const n = remove(store, ids.map(Number))
    save(store)
    if (n) ok(`removed ${n} item${n > 1 ? 's' : ''}`)
    else err('nothing removed')
  })

program
  .command('clean')
  .description('remove all done items')
  .action(() => {
    const store = load()
    const n = clean(store)
    save(store)
    if (n) ok(`removed ${n} done item${n > 1 ? 's' : ''}`)
    else ok('nothing to clean')
  })

program
  .command('ls')
  .description('list items (default: open only)')
  .option('-a, --all',       'show all items')
  .option('-d, --done',      'show only done items')
  .option('-t, --tag <tag>', 'filter by tag')
  .action((opts: { all?: boolean; done?: boolean; tag?: string }) => {
    const store = load()
    const items = opts.all  ? store.items
                : opts.done ? filter(store, { done: true,  tag: opts.tag })
                :             filter(store, { done: false, tag: opts.tag })
    printList(items)
    printSummary(store)
    console.log()
  })

// bare `tally` = show open items
program
  .action(() => {
    const store = load()
    const open = filter(store, { done: false })
    printList(open)
    printSummary(store)
    console.log()
  })

program.parse()
