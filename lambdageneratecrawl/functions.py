from keys import FSCLIENTKEY, FSSECRETKEY
import foursquare
import random
from math import sqrt
from math import e as eulers
from geopy.distance import vincenty

import pprint
pp = pprint.PrettyPrinter(indent=1, depth=2)

def get_crawl(topic, location, stops):
    """
    Called from main.py
    """
    return get_venue_list(topic, location, int(stops))


def score(cur_ven, ven):
    """
    This is the algorithm. Get the score between these two venues
    """
    try:
        alpha = 500
        numerator = (ven["rating"] * 0.75) + (2.5 * (1- eulers**(-ven["ratingSignals"]/144)))
        cur_coord = (cur_ven["location"]["lat"], cur_ven["location"]["lng"])
        ven_coord = (ven["location"]["lat"], ven["location"]["lng"])
        denominator = vincenty(cur_coord, ven_coord).meters + alpha
    except Exception as e:
        print "{}, \n has produced an error from {}".format(ven["name"], e)
        return float("-inf")
    return numerator / denominator


def get_venue_list(tops, loc, stops):
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
    # If venue is not verified, remove it and pick another
    # TODO

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
        
        if hiscore == float("-inf"):
            return format_return(locs)

        response["groups"][0]["items"].remove(entry_to_remove)
        locs.append(next_venue)
        stops -= 1

    return format_return(locs)


def format_return(locs):
    return {l["name"] : make_venue_object(l) for l in locs}


def make_venue_object(l):
    venue = {}
    try:
        name = l["name"]
    except:
        print "some location has no name"
        raise KeyError("FATAL ERROR: some venue has no name")

    try:
        venue["verified"] = l["verified"]
    except:
        venue["verified"] = False
        print name + " has not been verified"

    try:
        venue["lat"] = l["location"]["lat"]
        venue["lng"] = l["location"]["lng"]
    except:
        print name + " has no lat/long"
        raise KeyError("FATAL ERROR: " + name + " has no lat/long")

    try:
        venue["rating"] = l["rating"]
    except:
        venue["rating"] = None
        print name + " has no rating"

    try:
        venue["ratingSignals"] = l["ratingSignals"]
    except:
        venue["ratingSignals"] = None
        print name + " has no ratingSignals"

    try:
        venue["address"] = { }
        venue["address"]["streetNumber"] = l["location"]["address"]
        venue["address"]["city"]         = l["location"]["city"]
        venue["address"]["state"]        = l["location"]["state"]
        venue["address"]["postalCode"]   = l["location"]["postalCode"]
        venue["address"]["country"]      = l["location"]["country"]
        venue["address"]["cc"]           = l["location"]["cc"]
    except:
        print pp.pprint(l)
        print name + " has error in address"

    try:
        venue["formattedAddress"] = l["location"]["formattedAddress"]
    except:
        # venue["formattedAddress"] = None
        print name + " has error in formattedAddress"

    try:
        venue["price"] = l["price"]["tier"]
    except:
        # venue["price"] = None
        print name + " has no price tier"

    try:
        venue["isOpen"] = l["hours"]["isOpen"]
    except:
        # venue["isOpen"] = None
        print name + " has no price"

    try:
        venue["foursquareUrl"] = 'http://foursquare.com/v/'+l["id"]
    except:
        # venue["foursquareUrl"] = None
        print name + " has no id, cannot make URL"

    try:
        venue["phone"] = l["contact"]["phone"]
    except:
        # venue["phone"] = None
        print name + " has no phone listed"
        
    try:
        venue["formattedPhone"] = l["contact"]["formattedPhone"]
    except:
        # venue["formattedPhone"] = None
        print name + " has no formattedPhone listed"

    try:
        venue["twitter"] = l["contact"]["twitter"]
    except:
        # venue["twitter"] = None
        print name + " has no twitter listed"

    try:
        venue["facebookUrl"] = 'http://facebook.com/'+l["contact"]["facebook"]
    except:
        # venue["facebookUrl"] = None
        print name + " has no facebook listed"

    try:
        venue["menuUrl"]       = l["menu"]["url"]
        venue["menuMobileUrl"] = l["menu"]["mobileUrl"]
    except:
        # venue["menuUrl"]       = None
        # venue["menuMobileUrl"] = None
        print name + " has no menu"

    return venue


if __name__ == "__main__":
    topic = "beer"
    loc = "williamsburg brooklyn"
    stops = 5
    lst = get_crawl(topic, loc, stops)
    pp.pprint(lst)