import os
from flask import Flask,request
from dotenv import load_dotenv
from geopy.geocoders import Nominatim
from pymongo import MongoClient, TEXT
from geopy.exc import GeocoderTimedOut
from flask_cors import CORS  # Import CORS
# priyamtomar982@gmail.com using google
load_dotenv()

mongo_connection_string = os.getenv("MONGO_CONNECTION_STRING")
client = MongoClient(mongo_connection_string)

db = client["MapData"]
geolocator = Nominatim(user_agent="pincode_locator", timeout=5)

app = Flask(__name__)
CORS(app)

@app.route("/getCord")
def batch_geocode():
    """batch_geocode is use to convert the pincode into latitude 
    and return the data as List"""
    collection = db["Mapcollection"]
    pageval = int(request.args.get("page",1))
    total = int(request.args.get("limit",10))
    documents = list(
        collection.find({}).skip(pageval*total).limit(total)
    )
    pincodes = [terms["Pincode"] for terms in documents]
    crop_type = [terms["Crop_Type"] for terms in documents]
    crop_area = [terms["CROP_AREA"] for terms in documents]
    crop_prod = [terms["CROP_PRODUCTION"] for terms in documents]
    locations = []

    for pincode,cropt,cropa,cropp in zip(pincodes,crop_type,crop_area,crop_prod):
        try:
            l,pins = geolocator.geocode(pincode)
            locations.append([pins,cropt,cropa,cropp])
        except GeocoderTimedOut as e:
            print(f"Error processing Pincode {pincode}: {e}")
        except Exception:
            pass
    return locations

# Run the app
if __name__ == "__main__":
    app.run(debug=True)