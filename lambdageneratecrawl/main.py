from functions import get_crawl

def generate_crawl(event, context):
    topic = event['params']['querystring']['topic']
    location = event['params']['querystring']['location']
    stops = int(event['params']['querystring']['stops'])
    print 'Mapping \'{}\' stops of \'{}\' in \'{}\'!'.format(stops, topic, location)
    return get_crawl(topic, location, stops)