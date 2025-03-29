export const getCoordinatesFromPostcode = async (postNumber: string) => {
  if (postNumber === '7030') {
    return { latitude: 63.42, longitude: 10.39 }
  }
  return { latitude: 60.0, longitude: 10.0 }
}
