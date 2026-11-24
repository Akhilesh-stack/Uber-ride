export const VEHICLES = {
    car: { label: 'Car', seats: 4, icon: 'ri-car-fill', description: 'Comfortable, everyday rides', eta: '2 min' },
    moto: { label: 'Moto', seats: 1, icon: 'ri-motorbike-fill', description: 'Beat the traffic, solo', eta: '3 min' },
    auto: { label: 'Auto', seats: 3, icon: 'ri-taxi-fill', description: 'Affordable auto rides', eta: '3 min' },
}

// Older captain accounts may use 'motorcycle'
export const vehicleInfo = (type) => VEHICLES[ type === 'motorcycle' ? 'moto' : type ] || VEHICLES.car
