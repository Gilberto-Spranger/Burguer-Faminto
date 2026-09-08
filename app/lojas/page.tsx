'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Check,
  ExternalLink,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { Store } from '@/types';
import { Button } from '@/components/ui/button';

export default function LojasPage() {
  const { stores: storeList, selectedStore, setSelectedStore } = useStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [mapLoadError, setMapLoadError] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const [stores, setStores] = useState<Store[]>(storeList);

  useEffect(() => {
    if (storeList && storeList.length > 0) {
      setStores(storeList);
    }
  }, [storeList]);

  const [userLocation, setUserLocation] =
    useState<{ lat: number; lng: number } | null>(null);

  const [isLocating, setIsLocating] = useState(false);

  const [activeStore, setActiveStore] = useState<Store | null>(
    selectedStore || storeList[0] || null
  );

  useEffect(() => {
    if (!activeStore && storeList.length > 0) {
      setActiveStore(selectedStore || storeList[0]);
    }
  }, [storeList, selectedStore, activeStore]);

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      try {
        if (window.google?.maps) {
          setGoogleMapsLoaded(true);
          return;
        }

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          setMapLoadError(true);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setGoogleMapsLoaded(true);
          setMapLoadError(false);
        };
        script.onerror = () => {
          setMapLoadError(true);
          setGoogleMapsLoaded(false);
        };
        document.head.appendChild(script);

        return () => {
          const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
          scripts.forEach(s => s.remove());
        };
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setMapLoadError(true);
        setGoogleMapsLoaded(false);
      }
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (!googleMapsLoaded || !mapRef.current || mapLoadError || !activeStore) return;

    try {
      const defaultLocation = activeStore.coordinates || { lat: -8.8252, lng: 13.2327 };

      const map = new google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 13,
        styles: [
          { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#ffffff' }] },
          { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ color: '#000000' }, { weight: 2 }] },
          { featureType: 'all', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1a3b5c' }] },
          { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
          { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
          { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
          { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#333333' }] },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      setMapInstance(map);

      const newMarkers = stores.map((store) => {
        const marker = new google.maps.Marker({
          position: store.coordinates,
          map: map,
          title: store.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: activeStore.id === store.id ? '#E63946' : '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: activeStore.id === store.id ? 12 : 10,
          },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="color: #000; padding: 8px;">
              <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${store.name}</h3>
              <p style="font-size: 12px; margin-bottom: 4px;">${store.address}</p>
              <p style="font-size: 11px; color: #666;">${store.neighborhood}</p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          setActiveStore(store);
        });

        return marker;
      });

      setMarkers(newMarkers);

      return () => {
        newMarkers.forEach(marker => marker.setMap(null));
        map.setMap(null);
      };
    } catch (error) {
      console.error('Error initializing Google Map:', error);
      setMapLoadError(true);
      setGoogleMapsLoaded(false);
    }
  }, [googleMapsLoaded, stores, activeStore?.id, mapLoadError]);

  useEffect(() => {
    if (!mapInstance || markers.length === 0 || !activeStore) return;

    markers.forEach((marker, index) => {
      const store = stores[index];
      if (!store) return;
      marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: activeStore.id === store.id ? '#E63946' : '#3B82F6',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: activeStore.id === store.id ? 12 : 10,
      });
    });
  }, [activeStore?.id, mapInstance, markers, stores]);

  useEffect(() => {
    if (!mapInstance || !activeStore?.coordinates) return;
    mapInstance.panTo(activeStore.coordinates);
    mapInstance.setZoom(15);
  }, [activeStore, mapInstance]);

  useEffect(() => {
    if (!mapInstance || !userLocation) return;

    const userMarker = new google.maps.Marker({
      position: userLocation,
      map: mapInstance,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#10B981',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
        scale: 8,
      },
      title: 'Sua Localização',
    });

    const circle = new google.maps.Circle({
      center: userLocation,
      radius: 100,
      map: mapInstance,
      fillColor: '#10B981',
      fillOpacity: 0.1,
      strokeColor: '#10B981',
      strokeOpacity: 0.3,
      strokeWeight: 1,
    });

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(userLocation);
    stores.forEach(store => bounds.extend(store.coordinates));
    mapInstance.fitBounds(bounds);
    mapInstance.setZoom(13);

    return () => {
      userMarker.setMap(null);
      circle.setMap(null);
    };
  }, [userLocation, mapInstance, stores]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo teu navegador.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;

        setUserLocation({ lat: uLat, lng: uLng });

        const updatedStores = stores.map((store) => ({
          ...store,
          distanceKm: calculateDistance(
            uLat,
            uLng,
            store.coordinates.lat,
            store.coordinates.lng
          ),
        })).sort(
          (a, b) => (a.distanceKm || 999) - (b.distanceKm || 999)
        );

        setStores(updatedStores);
        if (updatedStores[0]) {
          setActiveStore(updatedStores[0]);
          setToastMessage(
            `Loja mais próxima: ${updatedStores[0].name} (${updatedStores[0].distanceKm} km)!`
          );
        }
        setIsLocating(false);

        setTimeout(() => setToastMessage(null), 4000);
      },
      () => {
        setIsLocating(false);
        const fallbackLat = -8.8252;
        const fallbackLng = 13.2327;

        const updatedStores = stores.map((store) => ({
          ...store,
          distanceKm: calculateDistance(
            fallbackLat,
            fallbackLng,
            store.coordinates.lat,
            store.coordinates.lng
          ),
        }));

        setStores(updatedStores);
        setToastMessage('Localização padrão de Luanda aplicada.');
        setTimeout(() => setToastMessage(null), 3000);
      }
    );
  };

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    setActiveStore(store);

    setToastMessage(
      `Loja selecionada: ${store.neighborhood}! Os teus pedidos sairão desta unidade.`
    );

    setTimeout(() => setToastMessage(null), 4000);
  };

  const currentActive = activeStore || stores[0];
  const isActiveStoreSelected =
    Boolean(selectedStore && currentActive && selectedStore.id === currentActive.id);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-28">
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-10 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-2">
                <MapPin className="w-4 h-4" />
                Luanda, Angola
              </div>

              <h1 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-tight">
                Nossas Lojas & Takeaway
              </h1>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 max-w-xl">
                Encontra o ponto Burguer Faminto mais próximo de ti em Luanda. Hambúrgueres artesanais estalando de quentes prontos para entrega rápida ou levantamento no balcão.
              </p>
            </div>

            <Button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="py-3 px-6 rounded-xl font-display font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              {isLocating ? 'A Localizar...' : 'Encontrar Loja Mais Próxima'}
            </Button>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[var(--accent-primary)] text-white px-6 py-3 rounded-full font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg uppercase font-bold tracking-wide">
                  Mapa Interativo Luanda
                </h3>

                <span className="text-xs bg-[var(--bg-primary)] px-2.5 py-1 rounded-full text-[var(--text-secondary)] border border-[var(--border-color)]">
                  {stores.length} Unidades
                </span>
              </div>

              <div className="relative h-64 w-full bg-[#111] rounded-xl overflow-hidden border border-[var(--border-color)]">
                {mapLoadError || !googleMapsLoaded ? (
                  <div className="relative w-full h-full p-4 flex flex-col justify-between bg-[#111]">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#E63946_1px,transparent_1px)] [background-size:16px_16px]" />

                    <div className="relative z-10 w-full h-full flex flex-wrap gap-2 items-center justify-center">
                      {stores.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setActiveStore(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentActive?.id === s.id
                              ? 'bg-[var(--accent-primary)] text-white shadow-lg scale-105'
                              : 'bg-black/80 text-white/80 border border-white/20 hover:border-white'
                          }`}
                        >
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {s.neighborhood}
                        </button>
                      ))}
                    </div>

                    <div className="relative z-10 text-[11px] text-[var(--text-secondary)] text-center">
                      Clica num dos pontos para ver detalhes da loja
                    </div>
                  </div>
                ) : (
                  <div ref={mapRef} className="w-full h-full" />
                )}
              </div>
            </div>

            {currentActive && (
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xl">
                <div className="relative h-48 w-full">
                  <Image
                    src={currentActive.image}
                    alt={currentActive.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-black/40 to-transparent" />

                  <div className="absolute top-3 left-3 bg-[var(--accent-primary)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {currentActive.neighborhood}
                  </div>

                  {currentActive.distanceKm !== undefined && (
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-[var(--accent-primary)]" />
                      {currentActive.distanceKm} km de ti
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-display font-bold text-xl uppercase leading-tight">
                      {currentActive.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 space-y-4 text-sm">
                  <div className="flex items-start gap-3 text-[var(--text-secondary)]">
                    <MapPin className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{currentActive.address}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">Ref: {currentActive.reference}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                      <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider">Aberto</span>
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">{currentActive.hours}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <Phone className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
                    <a href={`tel:${currentActive.phone}`} className="text-xs hover:underline">
                      {currentActive.phone}
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <a
                      href={`https://wa.me/${currentActive.whatsapp}?text=${encodeURIComponent(
                        `Olá Burguer Faminto ${currentActive.neighborhood}! Gostaria de saber mais sobre o menu e entregas.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${currentActive.name}, Luanda`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--text-primary)] text-[var(--text-primary)] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      GPS
                    </a>
                  </div>

                  <Button
                    onClick={() => handleSelectStore(currentActive)}
                    className={`w-full py-3 rounded-xl font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                      isActiveStoreSelected ? 'bg-green-600 hover:bg-green-700' : ''
                    }`}
                  >
                    {isActiveStoreSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        Loja Principal de Pedido
                      </>
                    ) : (
                      'Escolher Esta Loja Para Pedir'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display font-bold text-2xl uppercase tracking-wide mb-4">
              Todas as Unidades em Luanda
            </h2>

            {stores.map((store) => {
              const isCurrent = selectedStore?.id === store.id;
              const isSelectedInMap = currentActive?.id === store.id;

              return (
                <motion.div
                  key={store.id}
                  onClick={() => setActiveStore(store)}
                  className={`bg-[var(--bg-secondary)] border rounded-2xl p-5 transition-all cursor-pointer flex flex-col sm:flex-row gap-5 ${
                    isSelectedInMap
                      ? 'border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)] shadow-lg'
                      : 'border-[var(--border-color)] hover:border-[var(--text-secondary)]'
                  }`}
                >
                  <div className="relative w-full sm:w-44 h-36 rounded-xl overflow-hidden shrink-0 bg-[var(--bg-primary)]">
                    <Image
                      src={store.image}
                      alt={store.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {isCurrent && (
                      <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Check className="w-3 h-3" />
                        Tua Loja
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-display font-bold text-lg uppercase tracking-wide">
                          {store.name}
                        </h3>

                        {store.distanceKm !== undefined && (
                          <span className="text-xs font-bold text-[var(--accent-primary)] bg-[var(--bg-primary)] px-2 py-0.5 rounded-full border border-[var(--border-color)] whitespace-nowrap">
                            {store.distanceKm} km
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] mb-1">
                        {store.address}
                      </p>

                      <p className="text-[11px] text-[var(--text-secondary)]/80 italic mb-3">
                        Ponto de Ref: {store.reference}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                          <span>Aberto</span>
                          <span className="text-[var(--text-secondary)] font-normal">
                            • {store.hours}
                          </span>
                        </span>

                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                          {store.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--border-color)]/60 mt-3">
                      <a
                        href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
                          `Olá Burguer Faminto ${store.neighborhood}! Gostaria de fazer um pedido.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 uppercase tracking-wider"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Conversar no WhatsApp
                      </a>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleSelectStore(store);
                        }}
                        className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-colors ${
                          isCurrent
                            ? 'bg-green-600/20 text-green-400 border border-green-500/40'
                            : 'bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] text-[var(--text-primary)]'
                        }`}
                      >
                        {isCurrent ? 'Loja Selecionada ✓' : 'Definir Como Minha Loja'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
