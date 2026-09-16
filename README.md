# tally

terminal todo tracker. add items, check them off, clean up what's done.

stores everything in `~/.tally/store.json` — one json file, no database, no sync, no drama.

---

## usage

```sh
tally                           # show open items + progress bar
tally add "write tests"         # add item
tally add "ship v2" -t work     # add with tag
tally check 1 3                 # mark done
tally uncheck 2                 # undo
tally rm 5                      # remove permanently
tally clean                     # remove all done items
tally ls                        # open items only
tally ls -a                     # all items
tally ls -d                     # done only
tally ls -t work                # filter by tag
```

---

## example output

```
    1  ·  write tests  #work
    2  ✓  review pr
    3  ·  fix bug in parser  #work

   1/3  ████████░░░░░░░░░░░░░░░░  2 left
```

---

## structure

```
src/
  cli.ts       commander entrypoint — all commands
  store.ts     load/save/add/check/clean/filter — pure functions, no side effects
  display.ts   chalk-based rendering — printItem, printList, printSummary
tsconfig.json
package.json
```

## install

```sh
npm install
npm run build
node dist/cli.js add "hello"

# or run directly during dev
npm run dev -- add "hello"
```

requires node 18+.

## testing

installed deps, built with tsc, ran against real data:

- `add` — items created with correct ids, tags stored correctly
- `check` / `uncheck` — done status toggled, confirmed in `ls` output
- `clean` — done items removed, open items kept
- `ls` with `--all`, `--done`, `--tag` filters — all confirmed working
- progress bar renders correct fill based on done/total ratio

**not tested:** concurrent writes, non-utf8 text, very large store files, `rm` with invalid ids.

## license

MIT
