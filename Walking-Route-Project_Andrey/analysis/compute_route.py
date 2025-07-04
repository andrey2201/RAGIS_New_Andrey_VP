import osmnx as ox
import networkx as nx
import pandas as pd
import json

# Зареждане на локациите
locations = pd.read_csv("../data/locations.csv")

# Задаване на текущо местоположение
user_location = (42.6977, 23.3219)

# Изтегляне на пешеходната мрежа на София
print("Изтегляне на мрежата...")
G = ox.graph_from_place('Sofia, Bulgaria', network_type='walk')

def get_nearest_node(G, point):
    return ox.distance.nearest_nodes(G, point[1], point[0])

# Намиране на възли за потребителя и локациите
user_node = get_nearest_node(G, user_location)
location_nodes = [get_nearest_node(G, (row.lat, row.lon)) for idx, row in locations.iterrows()]

# Жаден алгоритъм: от текущото местоположение към най-близката локация, после към следващата най-близка и т.н.
current_node = user_node
route_nodes = []
remaining = set(location_nodes)

print("Изчисляване на оптималния маршрут...")

while remaining:
    nearest = min(remaining, key=lambda n: nx.shortest_path_length(G, current_node, n, weight='length'))
    route_nodes.append(nearest)
    remaining.remove(nearest)
    current_node = nearest

# Създаване на пълния маршрут (списък с възли)
full_route = []
current_node = user_node

for next_node in route_nodes:
    path = nx.shortest_path(G, current_node, next_node, weight='length')
    full_route.extend(path[:-1])
    current_node = next_node
full_route.append(route_nodes[-1])

# Превръщане на възлите в координати
route_coords = [(G.nodes[n]['y'], G.nodes[n]['x']) for n in full_route]

# Записване в JSON
with open('../data/route.json', 'w', encoding='utf-8') as f:
    json.dump(route_coords, f, ensure_ascii=False)

print("Маршрутът е записан в ../data/route.json")
