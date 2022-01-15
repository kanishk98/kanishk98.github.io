---
title: "Implementing a VP tree using a Postgres GIST index"
---

_notes_

_jan 15, 2022_

starting now, sorry for the delay, finally got around to it - this should be fun - i can't find any easy to follow guides on creating one, so i suppose i'll have to check out the code for the [btree gist index](https://github.com/postgres/postgres/tree/master/contrib/btree_gist) and look at the [docs](https://www.postgresql.org/docs/12/gist-extensibility.html) and then work this out from there. 

> There are five methods that an index operator class for GiST must provide, and four that are optional. Correctness of the index is ensured by proper implementation of the same, consistent and union methods

okay so those are the 3 i'll start with
arrrrgh they use c ofc they do what was i thinking but okay whatever i guess
i think i want a bigger monitor you know

hmm looks like we'll want to write an extension for this. following [this guide](http://big-elephants.com/2015-10/writing-postgres-extensions-part-i/) because it seems easy and it tells me how to run it against an active server. this series actually seems pretty comprehensive. gg. 

watched a little bit of tv, that shouldn't have happened
getting back to this now

