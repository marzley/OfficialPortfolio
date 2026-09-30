---
slug: graphs-bfs-dfs
title: Graphs, BFS and DFS: routes and connections
after: recursion
---
# Graphs, BFS and DFS: routes and connections

A **graph** is a set of **nodes** (vertices) connected by **edges**. Roads between towns, friends on social media, computers in a network, and pages linked on the web are all graphs. Graph algorithms power maps, delivery routing and recommendations.

## Representing a graph: adjacency list

```try-python
roads = {
    "Nairobi":  ["Thika", "Nakuru", "Machakos"],
    "Thika":    ["Nairobi", "Nyeri"],
    "Nakuru":   ["Nairobi", "Eldoret", "Kisumu"],
    "Machakos": ["Nairobi", "Mombasa"],
    "Nyeri":    ["Thika"],
    "Eldoret":  ["Nakuru", "Kisumu"],
    "Kisumu":   ["Nakuru", "Eldoret"],
    "Mombasa":  ["Machakos"],
}
for town, neighbours in roads.items():
    print(f"{town:<9} -> {', '.join(neighbours)}")
```

| Term | Meaning |
|---|---|
| **Undirected** | Roads go both ways |
| **Directed** | One-way (Twitter/X "follows", web links) |
| **Weighted** | Edges have a cost (distance in km, time, price) |
| **Path** | A sequence of connected nodes |
| **Cycle** | A path that returns to its start |

## Breadth-first search (BFS): explore level by level

BFS visits all neighbours first, then their neighbours, using a **queue**. In an unweighted graph it finds the path with the **fewest steps**.

```try-python
from collections import deque

roads = {
    "Nairobi": ["Thika", "Nakuru", "Machakos"], "Thika": ["Nairobi", "Nyeri"],
    "Nakuru": ["Nairobi", "Eldoret", "Kisumu"], "Machakos": ["Nairobi", "Mombasa"],
    "Nyeri": ["Thika"], "Eldoret": ["Nakuru", "Kisumu"], "Kisumu": ["Nakuru", "Eldoret"],
    "Mombasa": ["Machakos"],
}

def shortest_path(graph, start, goal):
    queue = deque([[start]])
    visited = {start}
    while queue:
        path = queue.popleft()
        town = path[-1]
        if town == goal:
            return path
        for nxt in graph[town]:
            if nxt not in visited:
                visited.add(nxt)
                queue.append(path + [nxt])
    return None

print(" -> ".join(shortest_path(roads, "Nyeri", "Kisumu")))
print(" -> ".join(shortest_path(roads, "Mombasa", "Eldoret")))
```

## Depth-first search (DFS): go deep, then backtrack

DFS follows one path as far as possible before backing up, using **recursion** (or a stack). Good for exploring everything, finding connected groups and detecting cycles.

```try-python
roads = {
    "Nairobi": ["Thika", "Nakuru"], "Thika": ["Nairobi", "Nyeri"], "Nyeri": ["Thika"],
    "Nakuru": ["Nairobi", "Kisumu"], "Kisumu": ["Nakuru"],
    "Lamu": ["Garissa"], "Garissa": ["Lamu"],          # a separate group: no road to the others here
}

def dfs(graph, town, visited=None):
    if visited is None:
        visited = []
    visited.append(town)
    for nxt in graph[town]:
        if nxt not in visited:
            dfs(graph, nxt, visited)
    return visited

print("Reachable from Nairobi:", dfs(roads, "Nairobi"))

groups, seen = [], set()
for town in roads:
    if town not in seen:
        group = dfs(roads, town)
        seen.update(group)
        groups.append(group)
print("Connected groups:", groups)
```

## Weighted graphs and Dijkstra's algorithm

When roads have distances, the path with the fewest towns isn't always the shortest. **Dijkstra's algorithm** always expands the closest unvisited town next, using a priority queue:

```try-python
import heapq

km = {
    "Nairobi": {"Nakuru": 160, "Machakos": 63, "Thika": 45},
    "Nakuru": {"Nairobi": 160, "Kisumu": 185, "Eldoret": 155},
    "Machakos": {"Nairobi": 63, "Mombasa": 430},
    "Thika": {"Nairobi": 45},
    "Kisumu": {"Nakuru": 185, "Eldoret": 115},
    "Eldoret": {"Nakuru": 155, "Kisumu": 115},
    "Mombasa": {"Machakos": 430},
}

def dijkstra(graph, start, goal):
    heap = [(0, start, [start])]
    best = {}
    while heap:
        dist, town, path = heapq.heappop(heap)
        if town == goal:
            return dist, path
        if town in best:
            continue
        best[town] = dist
        for nxt, d in graph[town].items():
            if nxt not in best:
                heapq.heappush(heap, (dist + d, nxt, path + [nxt]))
    return None

dist, path = dijkstra(km, "Mombasa", "Kisumu")
print(f"{' -> '.join(path)}: {dist} km")
```

(Distances are approximate, for practice.)

## Where graphs are used

| Application | Graph |
|---|---|
| Google Maps, delivery apps | Roads, weighted by time |
| Social networks | People and friendships ("people you may know") |
| Computer networks | Routers and links (routing protocols like OSPF use Dijkstra) |
| Web search | Pages and links |
| Project planning | Tasks and dependencies |

```quiz
Q: What are the connections between nodes in a graph called?
A: edges | edge
Q: Which search uses a queue and finds the path with the fewest steps? (three letters)
A: BFS | breadth-first search
Q: Which search goes deep first and often uses recursion? (three letters)
A: DFS | depth-first search
Q: Which algorithm finds the shortest route in a weighted graph?
A: Dijkstra | Dijkstra's | dijkstra's algorithm
Q: Is a graph where edges have a one-way direction called directed or undirected?
A: directed
```
