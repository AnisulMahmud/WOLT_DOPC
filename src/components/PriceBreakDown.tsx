import React from "react";

type Props = {
    data: {
        cartValue: number;
        fee: number;
        distance: number;
        smallOrderSurcharge: number;
        total: number;
    };
};

const PriceBreakDown:React.FC<Props> = ({ data }) => (
    <div>
        <h2>Price Breakdown</h2>
        <p>Cart Value: {data.cartValue.toFixed(2)} €</p>
        <p>Small Order Surcharge: {(data.smallOrderSurcharge / 100 ).toFixed(2)} €</p>
        <p>Delivery Fee: {(data.fee / 100).toFixed(2)} €</p>
        <p>Delivery Distance: {data.distance} m</p>
        <p>Total Price: {(data.total / 100).toFixed(2)} €</p>

    </div>
)

export default PriceBreakDown;