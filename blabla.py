import redis

# Connect to the redis database
r = redis.Redis(host='localhost', port=6379)

# Set a key-value pair
r.set('foo', 'bar')

# Get the value of the key
value = r.get('foo')

# Print the value
print(value)
