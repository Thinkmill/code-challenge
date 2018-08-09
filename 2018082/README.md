August 2018 challenge (part two)
=====================

**Due date: 22nd August 2018**

This months _second_ challenge consists of you writing two [sorting algorithms](https://en.wikipedia.org/wiki/Sorting_algorithm) from scratch.
This folder contains a json file `unsorted.json`.

In that file we can find an object with three arrays: `normies`, `heroes` and `villains`.
Each of those need to be sorted alphabetically by both algorithms [selection sort](https://en.wikipedia.org/wiki/Selection_sort) and
[merge sort](https://en.wikipedia.org/wiki/Merge_sort).

You need to output two things:
- Each list in three different json files: `normies.json`, `heroes.json` and `villains.json`
- You record the time it took for each algorithm to sort each list via the `time` bash helper `$ time node yourscript.js`

The output will then be:

```
# selection sort

normies.json
real	0m4.011s
user	0m2.631s
sys	0m0.787s

heroes.json
real	0m4.011s
user	0m2.631s
sys	0m0.787s

villains.json
real	0m4.011s
user	0m2.631s
sys	0m0.787s

# merge sort

normies.json
real	0m4.011s
user	0m2.631s
sys	0m0.787s

heroes.json
real	0m4.011s
user	0m2.631s
sys	0m0.787s

villains.json
real	0m4.011s
user	0m2.631s
sys	0m0.787s
```

The sorting order is:

```sh
a
b
c
d
e
f
g
h
i
j
k
l
m
n
o
p
q
r
s
t
u
v
w
x
y
z
 [space]
1
2
3
4
5
6
7
8
9
0
:
-
.
'
’
#
/
```

Also shorter is sorted higher:

```
foo
food
```

## RULEZ

1. Node only
1. No dependencies
1. No use of `sort`
