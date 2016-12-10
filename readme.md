# BarCrawler

Link to live site [BarCrawler](http://barcrawler2016.herokuapp.com)

Given a location and a search term, we will make you a tour of the neighborhood hitting the hottest spots.

## Contributors

[Michael Garod](http://github.com/mgarod) DevOps, Full Stack Engineer

![alt text](https://github.com/mgarod/mgarod.github.io/blob/master/images/self.png)

Michael has been working as a Computer science tutor at Hunter College for 2 years, and has recently completed a summer with Barclays as a Technology Analyst. Before that, he was a research assistant for Professor Carsten Kessler at Hunter College studying Wikipedia's role in geography theory. Michael has a passion for databases and big data technologies, cloud computing with AWS, and the elegance of Python.

[Igor Gluskin](http://github.com/igorgluskin)

![alt text](https://avatars0.githubusercontent.com/u/22086293?v=3&s=460)

Igor is an undergraduate student at Hunter College, studying Computer Science, with minors in mathematics and economics. He is interested in app development, and other mobile tech projects. He is also a ballroom dance instructor. 

[Richard Cibu](http://github.com/r1chc)

Hunter College student--double major in Computer Science and Economics; minor in Political Science. Interested in the fields of Network Security and Big Data Analysis. Currently working at Cravath, Swaine & Moore LLP in the IT department and is an avid soccer player in his spare time. 

## API

#### GET Generate Crawl
Parameters: topic, location, and number of stops.
Return: JSON. All strings are unicode
```
{
  "unique_id": string (8-digit hexadecimal),
  "topic" : string,
  "location" : string,
  "stops" : integer,
  "venues" : {
    'venue1name': {
          "verified"      : boolean
          "lat"           : float latitude
          "lng"           : float longitude
          "rating"        : float (out of 10)
          "ratingSignals" : integer
          "address": {
            "streetNumber"  : string (e.g. '123 Fake St.')
            "city"          : string (e.g. 'New York')
            "state"         : string (e.g. 'NY')
            "postalCode"    : string (e.g. '10036')
            "country"       : string (e.g. 'United States')
            "cc"            : string (e.g. 'US')
          }
          "formattedAddress" : [
            string StreetNameNumber,
            string CityStateZip,
            string Country
          ]
          "price"          : integer ([1,2,3,4])
          "isOpen"         : boolean
          "foursquareUrl"  : string URL
          "phone"          : string
          "formattedPhone" : string
          "twitter"        : string URL
          "facebookUrl"    : string URL
          "menuUrl"        : string URL
          "menuMobileUrl"  : string URL
    }
    'venue2name': ...
    ...
    'venueNname': ...
  }
}
```
