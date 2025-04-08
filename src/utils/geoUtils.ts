export const getCoordinatesFromPostcode = async (postNumber: string) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${postNumber}&country=Norway&format=json`)
  const data = await response.json()

  if (data.length > 0) {
    const { lat, lon } = data[0]
    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon)
    }
  } else {
    throw new Error(`Fant ingen koordinater for postnummer ${postNumber}`)
  }
}
