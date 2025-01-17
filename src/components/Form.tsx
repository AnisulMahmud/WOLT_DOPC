import React, { useState } from 'react';
import PriceBreakDown from './PriceBreakDown';
import { fetchStaticData, fetchDynamicData } from '../api/api';
import { calcualteDistance, deliveryFee } from '../utils/calculate';
import './Form.css';
import WoltLogo from '../assets/wolt.jpg';

const Form = () => {
  const [venueSlug, setVenueSlug] = useState('');
  const [cartValue, setCartValue] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [priceBreakDown, setPriceBreakDown] = useState<any>(null);

  // if anyone wants to use their own location
  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude.toString());
      setLongitude(position.coords.longitude.toString());
    }, () => {
      alert('Unable to retrieve your location.');
    });
  };


  const handleCalculate = async () => {
    const parsedCartValue = parseFloat(cartValue);
    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);

    //  Validations

    if (!venueSlug.trim()) {
      alert('Venue slug is required.');
      return;
    }

    if (isNaN(parsedCartValue) || parsedCartValue <= 0) {
      alert('Cart value must be a positive number using a dot (.) as the decimal separator.');
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

  return (
    <div className="page-container">
      <div className="header">
        <img src={WoltLogo} alt="Wolt Logo" className="logo" />
        <h1>Wolt Delivery</h1>
      </div>

    <div className="calculator-container">
      <h2>Delivery Order Price Calculator</h2>

      <div className="form-section">
        <h3>Details</h3>

        <label>Venue Slug</label>
        <input
          type="text"
          placeholder="Enter venue slug"
          value={venueSlug}
          onChange={(e) => setVenueSlug(e.target.value)}
          data-test-id="venueSlug"
        />
  
        <label>Cart Value (EUR)</label>
        <input
          type="text"
          placeholder="Enter cart value (€)"
          value={cartValue}
          onChange={(e) => {
            const value = e.target.value;
            // to allows numbers with a dot (.) as a decimal separator, no commas
            if (/^\d*\.?\d*$/.test(value)) {
              setCartValue(value);
            }
          }}
          data-test-id="cartValue"
        />

   
        <label>User Latitude</label>
        <input
          type="text"
          placeholder="Enter latitude"
          value={latitude}
          onChange={(e) => {
            const value = e.target.value;
            // to allow negative/decimal numbers
            if (/^-?\d*\.?\d*$/.test(value)) {
              setLatitude(value);
            }
          }}
          data-test-id="userLatitude"
        />

       
        <label>User Longitude</label>
        <input
          type="text"
          placeholder="Enter longitude"
          value={longitude}
          onChange={(e) => {
            const value = e.target.value;
            // to allow negative/decimal numbers
            if (/^-?\d*\.?\d*$/.test(value)) {
              setLongitude(value);
            }
          }}
          data-test-id="userLongitude"
        />

        <button
          data-test-id="getLocation"
          onClick={handleGetLocation}
        >
          Get Location
        </button>


        <button data-test-id="calculate" onClick={handleCalculate}>
          Calculate Delivery Price
        </button>
      </div>

   
      {priceBreakDown && <PriceBreakDown data={priceBreakDown} />}
    </div>
    </div>
  );
};

export default Form;
