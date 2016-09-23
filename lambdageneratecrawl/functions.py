from keys import FSCLIENTKEY, FSSECRETKEY
import foursquare
import folium
import random
from math import sqrt
from math import e as eulers
from geopy.distance import vincenty

def get_crawl(topic, location, stops):
    """
    Called from main.py
    """
    venuelist = get_venue_list(topic, location, stops)
    return make_crawl(venuelist)

def score(cur_ven, ven):
    """
    This is the algorithm. Get the score between these two venues
    """
    alpha = 500
    numerator = (ven["rating"] * 0.75) + (2.5 * (1- eulers**(-ven["ratingSignals"]/144)))
    cur_coord = (cur_ven["location"]["lat"], cur_ven["location"]["lng"])
    ven_coord = (ven["location"]["lat"], ven["location"]["lng"])
    denominator = vincenty(cur_coord, ven_coord).meters + alpha
    return numerator / denominator

def get_venue_list(tops, loc, stops):
    # x = 'drinks'
    # loc = 'west village nyc'
    # stops = 5

    client = foursquare.Foursquare(client_id=FSCLIENTKEY,client_secret=FSSECRETKEY)
    response = client.venues.explore(
      params={'section': tops,
              'near': loc,
              'radius': 1000,
              'limit': 50}
    )

    # Randomly choose the first location
    locs = []
    current_venue = random.choice(response["groups"][0]["items"])
    response["groups"][0]["items"].remove(current_venue)
    current_venue = current_venue["venue"]
    locs.append(current_venue)
    stops -= 1
    
    while stops > 0:
        hiscore = float("-inf")
        next_venue = None
        entry_to_remove = None
        for v in response["groups"][0]["items"]:
            to_remove = v
            v = v["venue"]
            this_score = score(current_venue, v)
            if this_score > hiscore:
                hiscore = this_score
                next_venue = v
                entry_to_remove = to_remove
        
        response["groups"][0]["items"].remove(entry_to_remove)
        locs.append(next_venue)
        stops -= 1

    return locs

def make_crawl(listofvenues):
    lat = listofvenues[0]["location"]["lat"]
    lng = listofvenues[0]["location"]["lng"]
    name = listofvenues[0]["name"]
    
    crawl_map = folium.Map(location=[lat, lng], zoom_start=16)
    folium.Marker(location=[lat, lng], popup=name).add_to(crawl_map)
    
    line_points = []
    line_points.append((lat, lng))
    listofvenues.pop(0)
    for v in listofvenues:
        lat = v["location"]["lat"]
        lng = v["location"]["lng"]
        name = v["name"]
        folium.Marker(location=[lat, lng], popup=name).add_to(crawl_map)
        line_points.append((lat, lng))
    
    folium.PolyLine(locations=line_points, color='blue', opacity=1.0).add_to(crawl_map)

    try:
        crawl_map.save('/tmp/crawl_map.html')
        with open('/tmp/crawl_map.html', 'r') as f:
            return f.read()
    except Exception as e:
        print "EXCEPTION: {}".format(e)
        return "Could not save crawl or open file"