import { useEffect, useRef, useState } from 'react';

// Google Maps JS API is loaded globally via script tag in index.html.
// Access via window.google.maps — check presence before use.

// UNTITLED UI: https://untitledui.com/components/input
// TODO: Replace search input with <Input> (with search icon) from @untitled-ui/react.
// TODO: Replace confirm button with <Button> (primary) from @untitled-ui/react.
// TODO: Replace pin tooltip with <Tooltip> from @untitled-ui/react.

const NAIROBI = { lat: -1.286389, lng: 36.817223 };

/**
 * Google Maps address picker with Places Autocomplete.
 *
 * @param {{
 *   onAddressSelect: (addr: {
 *     lat: number,
 *     lng: number,
 *     formatted_address: string,
 *     google_place_id: string,
 *     address_line1: string,
 *     city: string,
 *   }) => void
 * }} props
 */
export default function AddressMap({ onAddressSelect }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [mapsReady, setMapsReady] = useState(false);

  // Poll for Google Maps SDK readiness (async script load)
  useEffect(() => {
    const check = () => {
      if (window.google?.maps?.Map) {
        setMapsReady(true);
      } else {
        setTimeout(check, 300);
      }
    };
    check();
  }, []);

  // Initialise map + marker + autocomplete once SDK is ready
  useEffect(() => {
    if (!mapsReady || !mapRef.current || mapInstanceRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: NAIROBI,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
    });
    mapInstanceRef.current = map;

    const marker = new window.google.maps.Marker({
      position: NAIROBI,
      map,
      draggable: true,
      title: 'Drag to set your delivery location',
    });
    markerRef.current = marker;

    // Reverse-geocode on marker drag end
    marker.addListener('dragend', () => {
      const pos = marker.getPosition();
      reverseGeocode(pos.lat(), pos.lng());
    });

    // Places Autocomplete
    if (inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'ke' },
        fields: ['geometry', 'formatted_address', 'place_id', 'address_components'],
      });
      autocompleteRef.current = autocomplete;

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        map.setCenter({ lat, lng });
        map.setZoom(15);
        marker.setPosition({ lat, lng });

        const addr = parsePlace(place, lat, lng);
        setSelectedAddress(addr);
      });
    }
  }, [mapsReady]);

  const reverseGeocode = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const place = results[0];
        const addr = parsePlace(
          { ...place, place_id: place.place_id },
          lat,
          lng
        );
        setSelectedAddress(addr);
      }
    });
  };

  const parsePlace = (place, lat, lng) => {
    const components = place.address_components ?? [];
    const get = (type) =>
      components.find((c) => c.types.includes(type))?.long_name ?? '';

    const streetNumber = get('street_number');
    const route = get('route');
    const locality =
      get('locality') || get('administrative_area_level_2') || get('sublocality');

    return {
      lat,
      lng,
      formatted_address: place.formatted_address ?? '',
      google_place_id: place.place_id ?? '',
      address_line1: [streetNumber, route].filter(Boolean).join(' ') || place.formatted_address,
      city: locality,
    };
  };

  const handleConfirm = () => {
    if (selectedAddress) {
      onAddressSelect(selectedAddress);
    }
  };

  return (
    <div className="space-y-3">
      {/* Places Autocomplete search */}
      {/* UNTITLED UI: Input (with search icon) stub */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search your delivery address…"
          className="block w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Map canvas */}
      {!mapsReady && (
        <div className="h-64 rounded-xl bg-gray-100 flex items-center justify-center text-sm text-gray-500 animate-pulse">
          Loading map…
        </div>
      )}
      <div
        ref={mapRef}
        className={`h-64 rounded-xl overflow-hidden border border-gray-200 ${!mapsReady ? 'hidden' : ''}`}
      />

      {/* Selected address confirmation */}
      {selectedAddress && (
        <div className="rounded-lg bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-800">
          {/* UNTITLED UI: Tooltip on marker stub */}
          <p className="font-medium">📍 {selectedAddress.formatted_address}</p>
        </div>
      )}

      {/* Confirm button */}
      {/* UNTITLED UI: Button (primary) stub */}
      <button
        onClick={handleConfirm}
        disabled={!selectedAddress}
        className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Confirm Location
      </button>
    </div>
  );
}
