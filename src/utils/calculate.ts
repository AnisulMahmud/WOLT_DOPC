export const calcualteDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3 ; // earth radius in meters
    const radians = (degrees: number) => degrees * Math.PI / 180;   // degrees to radians

   
    // difference in lat and lon in radians
    const diffLat = radians(lat2 - lat1);
    const diffLon = radians(lon2 - lon1);

    // Harvasine formula
    const angularDis = Math.sin(diffLat/2) ** 2 +
              Math.cos(radians(lat1)) * Math.cos(radians(lat2)) *
              Math.sin(diffLon/2) ** 2;


    return Math.round(2 * R * Math.atan2(Math.sqrt(angularDis), Math.sqrt(1 - angularDis)));      


}


export const deliveryFee = (distance: number, basePrice:number, distanceRange: any[]) => {
    let deliveryFees = basePrice;

    for( let range of distanceRange){
        if(distance >= range.min && ( distance < range.max || range.max === 0)) {
            deliveryFees += range.a + Math.round((range.b * distance) / 10);
            break;
        }
    }
    return deliveryFees;
}