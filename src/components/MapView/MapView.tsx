import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  municipio?: string;
  bairro?: string;
}

// Componente para atualizar o centro do mapa
function ChangeMapView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ municipio, bairro }: MapViewProps) {
  const [position, setPosition] = useState<[number, number]>([-15.7801, -47.9292]); // Brasília como padrão
  const [zoom, setZoom] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchLocation = async () => {
      if (!municipio) {
        // Voltar para Brasília se não houver município
        setPosition([-15.7801, -47.9292]);
        setZoom(10);
        return;
      }

      setLoading(true);
      try {
        // Construir query de busca
        const query = bairro ? `${bairro}, ${municipio}, Brasil` : `${municipio}, Brasil`;
        
        // Usar Nominatim (OpenStreetMap) para geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
        );
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setPosition([parseFloat(lat), parseFloat(lon)]);
          setZoom(bairro ? 14 : 12); // Zoom maior se houver bairro
        }
      } catch (error) {
        console.error('Erro ao buscar localização:', error);
      } finally {
        setLoading(false);
      }
    };

    searchLocation();
  }, [municipio, bairro]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {loading && (
        <div className="absolute top-2 right-2 z-[1000] bg-white px-2 py-1 rounded shadow text-xs text-gray-600">
          Carregando...
        </div>
      )}
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <ChangeMapView center={position} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {municipio && (
          <Marker position={position}>
            <Popup>
              {bairro ? `${bairro}, ${municipio}` : municipio}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
