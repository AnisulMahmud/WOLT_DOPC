import React, { useState} from 'react'
import PriceBreakDown from './PriceBreakDown'
import { fetchStaticData, fetchDynamicData } from '../api/api'
import { calcualteDistance, deliveryFee } from '../utils/calculate'
import './Form.css'


const Form = () => {
  
    const [venueSlug, setVenueSlug] = useState('');
    const [cartValue, setCartValue] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [priceBreakDown, setPriceBreakDown] = useState<any>(null);

    const handleCalculate = async () => {
        const parsedCartValue = parseFloat(cartValue);
        const parsedLatitude = parseFloat(latitude);
        const parsedLongitude = parseFloat(longitude);
    
 
        if (!venueSlug) {
          alert('Venue slug is required.');
          return;
        }
        if (isNaN(parsedCartValue) || parsedCartValue <= 0) {
          alert('Cart value must be a positive number.');
          return;
        }
        if (isNaN(parsedLatitude) || parsedLatitude < -90 || parsedLatitude > 90) {
          alert('Latitude must be a number between -90 and 90.');
          return;
        }
        if (isNaN(parsedLongitude) || parsedLongitude < -180 || parsedLongitude > 180) {
          alert('Longitude must be a number between -180 and 180.');
          return;
        }
    
        try {
          const staticData = await fetchStaticData(venueSlug);
          const dynamicData = await fetchDynamicData(venueSlug);
    
          const venueLat = staticData.venue_raw.location.coordinates[1];
          const venueLon = staticData.venue_raw.location.coordinates[0];
    
          const distance = calcualteDistance(parsedLatitude, parsedLongitude, venueLat, venueLon);
          const fee = deliveryFee(
            distance,
            dynamicData.venue_raw.delivery_specs.delivery_pricing.base_price,
            dynamicData.venue_raw.delivery_specs.delivery_pricing.distance_ranges
          );
    
          const smallOrderSurcharge = Math.max(
            0,
            dynamicData.venue_raw.delivery_specs.order_minimum_no_surcharge - parsedCartValue * 100
          );
    
          const total = fee + smallOrderSurcharge + parsedCartValue * 100;
    
          setPriceBreakDown({
            cartValue: parsedCartValue,
            fee,
            distance,
            smallOrderSurcharge,
            total,
          });
        } catch (error) {
          console.error('Error fetching data:', error);
          alert('An error occurred while calculating the delivery price.');
        }
      };

    return(
        <div className="calculator-container">
        <h2>Delivery Order Price Calculator</h2>
  
        <div className="form-section">
          <h3>Details</h3>
  
          <label>Venue slug</label>
          <input
            type="text"
            value={venueSlug}
            onChange={(e) => setVenueSlug(e.target.value)}
            data-test-id="venueSlug"
          />
  
          <label>Cart value (EUR)</label>
          <input
            type="text"
            placeholder='Enter your cart value(EUR)'
            value={cartValue}
            onChange={(e) => setCartValue(Number(e.target.value))}
            data-test-id="cartValue"
          />
  
          <label>User latitude</label>
          <input
            type="text"
            placeholder='Enter your latitude'
            value={latitude}
            onChange={(e) => setLatitude(Number(e.target.value))}
            data-test-id="userLatitude"
          />
  
          <label>User longitude</label>
          <input
            type="text"
            placeholder='Enter your longitude'
            value={longitude}
            onChange={(e) => setLongitude(Number(e.target.value))}
            data-test-id="userLongitude"

          />

        <button
        data-test-id="getLocation"
        onClick={() => {
            navigator.geolocation.getCurrentPosition((position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            });
        }}
        >
        Get location
        </button>
  
        <button onClick={handleCalculate}>Calculate delivery price</button>

        </div>

        {priceBreakDown && <PriceBreakDown data={priceBreakDown} />}


        </div>

    );
}

export default Form