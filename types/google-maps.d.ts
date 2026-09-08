declare namespace google {
  namespace maps {
    class Map {
      constructor(
        mapDiv: HTMLElement,
        opts?: MapOptions
      );

      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      setMapTypeId(mapTypeId: string): void;
      fitBounds(bounds: LatLngBounds): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
      setMap(map: Map | null): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
      disableDefaultUI?: boolean;
      zoomControl?: boolean;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      styles?: MapTypeStyle[];
    }

    interface MapTypeStyle {
      elementType?: string;
      featureType?: string;
      stylers?: Record<
        string,
        string | number | boolean
      >[];
    }

    class Marker {
      constructor(opts?: MarkerOptions);

      setMap(map: Map | null): void;

      setIcon(
        icon: string | Symbol | null
      ): void;

      addListener(
        eventName: string,
        handler: (...args: any[]) => void
      ): MapsEventListener;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Symbol;
      clickable?: boolean;
      draggable?: boolean;
      visible?: boolean;
      zIndex?: number;
    }

    class InfoWindow {
      constructor(
        opts?: InfoWindowOptions
      );

      open(
        map: Map,
        anchor?: Marker
      ): void;

      close(): void;

      setContent(
        content: string | HTMLElement
      ): void;

      getContent(): string | HTMLElement | null;
    }

    interface InfoWindowOptions {
      content?: string | HTMLElement;
      maxWidth?: number;
      ariaLabel?: string;
    }

    class Circle {
      constructor(
        opts?: CircleOptions
      );

      setMap(map: Map | null): void;
      setCenter(
        center: LatLng | LatLngLiteral
      ): void;
      setRadius(radius: number): void;
    }

    interface CircleOptions {
      map?: Map;
      center?: LatLng | LatLngLiteral;
      radius?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      clickable?: boolean;
      editable?: boolean;
      draggable?: boolean;
      visible?: boolean;
      zIndex?: number;
    }

    class LatLng {
      constructor(
        lat: number,
        lng: number
      );

      lat(): number;
      lng(): number;
      toJSON(): LatLngLiteral;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLngBounds {
      constructor(
        sw?: LatLng | LatLngLiteral,
        ne?: LatLng | LatLngLiteral
      );

      extend(
        point: LatLng | LatLngLiteral
      ): LatLngBounds;

      isEmpty(): boolean;

      getCenter(): LatLng;

      getNorthEast(): LatLng;

      getSouthWest(): LatLng;
    }

    class MapsEventListener {
      remove(): void;
    }

    enum SymbolPath {
      CIRCLE = 0,
      BACKWARD_CLOSED_ARROW = 1,
      BACKWARD_OPEN_ARROW = 2,
      FORWARD_CLOSED_ARROW = 3,
      FORWARD_OPEN_ARROW = 4,
    }

    interface Symbol {
      path?: SymbolPath | string;
      scale?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      rotation?: number;
      anchor?: Point;
      labelOrigin?: Point;
    }

    class Point {
      constructor(
        x: number,
        y: number
      );

      x: number;
      y: number;
    }
  }
}

interface Window {
  google?: typeof google;
}
