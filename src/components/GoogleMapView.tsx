import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Home, Heart, Filter, Navigation } from "lucide-react";
import { getLocationSettings } from "@/services/locationService";
import type { Incident } from "@/types/incident";
import type { MissingPerson } from "@/types/missing";

interface GoogleMapViewProps {
  incidents: Incident[];
  missingPersons?: MissingPerson[];
  currentPosition?: { lat: number; lng: number } | null;
  activeFilter?: string;
  onLocationSelect?: (location: {
    lat: number;
    lng: number;
    name: string;
  }) => void;
}

const GoogleMapView = ({
  incidents,
  missingPersons = [],
  currentPosition,
  activeFilter = "all",
  onLocationSelect,
}: GoogleMapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);
  const [locationCircle, setLocationCircle] =
    useState<google.maps.Circle | null>(null);

  const getMarkerColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
        return "#dc2626"; // red-600
      case "high":
        return "#ea580c"; // orange-600
      case "medium":
        return "#ca8a04"; // yellow-600
      case "low":
        return "#16a34a"; // green-600
      default:
        return "#6b7280"; // gray-500
    }
  };

  const getIncidentIcon = (type: string) => {
    const icons = {
      crime: "🔪",
      traffic: "🚗",
      fire: "🔥",
      flood: "🌊",
      subway: "🚇",
      disaster: "🌪",
      other: "⚠️",
    };
    return icons[type as keyof typeof icons] || "⚠️";
  };

  const getIncidentTypeLabel = (type: string) => {
    const labels = {
      crime: "범죄",
      traffic: "교통사고",
      fire: "화재",
      flood: "침수",
      subway: "지하철",
      disaster: "재난",
      other: "기타",
    };
    return labels[type as keyof typeof labels] || "기타";
  };

  const getMissingIcon = (age: number) => {
    return age < 18 ? "🧒" : "❓";
  };

  const createEmojiMarker = (
    position: google.maps.LatLngLiteral,
    emoji: string,
    title: string,
    color = "#4285f4"
  ) => {
    return new google.maps.Marker({
      position,
      map: map,
      title,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="2"/>
            <text x="20" y="26" text-anchor="middle" font-size="16" fill="white">${emoji}</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20),
      },
    });
  };

  // 거리 계산 함수 (km)
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 지도 클릭 이벤트 처리
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const location = {
        lat,
        lng,
        name: `선택된 위치 (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      };

      setSelectedLocation(location);
      onLocationSelect?.(location);

      // 기존 원 제거
      if (locationCircle) {
        locationCircle.setMap(null);
      }

      // 새 원 생성 (반경 2km)
      const circle = new google.maps.Circle({
        strokeColor: "#3b82f6",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#3b82f6",
        fillOpacity: 0.15,
        map: map,
        center: { lat, lng },
        radius: 2000, // 2km
      });

      setLocationCircle(circle);

      // 지도 중심을 선택된 위치로 이동
      map?.panTo({ lat, lng });
    }
  };

  useEffect(() => {
    // localStorage에서 Google Maps API 키 불러오기
    const savedKey = localStorage.getItem("google_maps_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  useEffect(() => {
    if (!apiKey) return;

    const initMap = async () => {
      if (!mapRef.current) return;

      const loader = new Loader({
        apiKey: apiKey,
        version: "weekly",
        libraries: ["places"],
      });

      try {
        const google = await loader.load();

        // 현재 위치 우선, 없으면 서울 중심
        const center = currentPosition || { lat: 37.5665, lng: 126.978 };

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: center,
          zoom: currentPosition ? 16 : 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        // 지도 클릭 이벤트 추가
        mapInstance.addListener("click", handleMapClick);

        setMap(mapInstance);
      } catch (error) {
        console.error("Google Maps API 로드 실패:", error);
      }
    };

    initMap();
  }, [apiKey, currentPosition]);

  useEffect(() => {
    if (!map) return;

    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // 저장된 위치들 표시
    const locationSettings = getLocationSettings();

    // 내 집 마커
    if (
      locationSettings.homeLocation &&
      locationSettings.homeLocation.isActive
    ) {
      const homeMarker = createEmojiMarker(
        locationSettings.homeLocation.coordinates,
        "🏠",
        `내 집: ${locationSettings.homeLocation.name}`,
        "#10b981"
      );
      newMarkers.push(homeMarker);
    }

    // 관심 지역 마커
    locationSettings.interestLocations
      .filter((loc) => loc.isActive)
      .forEach((location, index) => {
        const interestMarker = createEmojiMarker(
          location.coordinates,
          "🏡",
          `관심 지역: ${location.name}`,
          "#8b5cf6"
        );
        newMarkers.push(interestMarker);
      });

    // 필터링된 사건 마커 추가
    let filteredIncidents =
      activeFilter === "all"
        ? incidents
        : incidents.filter((incident) => incident.type === activeFilter);

    // 선택된 위치가 있으면 반경 2km 내 사건만 표시
    if (selectedLocation) {
      filteredIncidents = filteredIncidents.filter((incident) => {
        if (!incident.coordinates) return false;
        const distance = calculateDistance(
          selectedLocation.lat,
          selectedLocation.lng,
          incident.coordinates.lat,
          incident.coordinates.lng
        );
        return distance <= 2; // 2km 이내
      });
    }

    filteredIncidents.forEach((incident) => {
      if (incident.coordinates) {
        const marker = new google.maps.Marker({
          position: {
            lat: incident.coordinates.lat,
            lng: incident.coordinates.lng,
          },
          map: map,
          title: `${getIncidentIcon(incident.type)} ${getIncidentTypeLabel(
            incident.type
          )}: ${incident.title}`,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="16" fill="${getMarkerColor(
                  incident.riskLevel
                )}" stroke="white" stroke-width="2"/>
                <text x="18" y="23" text-anchor="middle" font-size="14" fill="white">${getIncidentIcon(
                  incident.type
                )}</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(36, 36),
            anchor: new google.maps.Point(18, 18),
          },
        });

        const formatTime = (timeString: string) => {
          const date = new Date(timeString);
          return (
            date.toLocaleDateString("ko-KR") +
            " " +
            date.toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        };

        const getRiskLevelText = (level: string) => {
          const levels = {
            critical: "매우 위험",
            high: "위험",
            medium: "주의",
            low: "참고",
          };
          return levels[level as keyof typeof levels] || "알 수 없음";
        };

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="max-width: 280px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="font-size: 20px;">${getIncidentIcon(
                  incident.type
                )}</span>
                <span style="background: ${getMarkerColor(
                  incident.riskLevel
                )}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                  ${getRiskLevelText(incident.riskLevel)}
                </span>
              </div>
              <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px; line-height: 1.3;">${
                incident.title
              }</h3>
              <p style="margin: 0 0 6px 0; color: #666; font-size: 14px;">📍 ${
                incident.location
              }</p>
              <p style="margin: 0 0 6px 0; color: #666; font-size: 12px;">🕐 ${formatTime(
                incident.timestamp
              )}</p>
              <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.4;">${
                incident.description
              }</p>
              ${
                incident.reportCount
                  ? `<p style="margin: 0 0 8px 0; color: #f59e0b; font-size: 13px; font-weight: bold;">📢 제보 ${incident.reportCount}건</p>`
                  : ""
              }
              ${
                incident.aiSuggestion
                  ? `
                <div style="margin-top: 8px; padding: 8px; background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 6px; font-size: 13px;">
                  <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
                    <span style="color: #2563eb; font-weight: bold;">🤖 AI 제안</span>
                  </div>
                  <p style="margin: 0; color: #1e40af; line-height: 1.3;">${incident.aiSuggestion}</p>
                </div>
              `
                  : ""
              }
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        newMarkers.push(marker);
      }
    });

    // 실종자 마커 추가 (필터가 'missing' 또는 'all'일 때만)
    if (activeFilter === "all" || activeFilter === "missing") {
      let filteredMissingPersons = missingPersons;

      // 선택된 위치가 있으면 반경 2km 내 실종자만 표시
      if (selectedLocation) {
        filteredMissingPersons = missingPersons.filter((person) => {
          if (!person.coordinates) return false;
          const distance = calculateDistance(
            selectedLocation.lat,
            selectedLocation.lng,
            person.coordinates.lat,
            person.coordinates.lng
          );
          return distance <= 2; // 2km 이내
        });
      }

      filteredMissingPersons.forEach((person) => {
        if (person.coordinates) {
          const marker = new google.maps.Marker({
            position: {
              lat: person.coordinates.lat,
              lng: person.coordinates.lng,
            },
            map: map,
            title: `실종: ${person.name}`,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="16" fill="#f59e0b" stroke="white" stroke-width="2"/>
                  <text x="18" y="23" text-anchor="middle" font-size="14" fill="white">${getMissingIcon(
                    person.age
                  )}</text>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(36, 36),
              anchor: new google.maps.Point(18, 18),
            },
          });

          const formatTime = (timeString: string) => {
            const date = new Date(timeString);
            return (
              date.toLocaleDateString("ko-KR") +
              " " +
              date.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })
            );
          };

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="max-width: 250px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #f59e0b; font-size: 16px;">❓ 실종 - ${
                  person.name
                }</h3>
                <p style="margin: 0 0 4px 0; font-size: 14px;"><strong>나이:</strong> ${
                  person.age
                }세 (${person.gender === "male" ? "남성" : "여성"})</p>
                <p style="margin: 0 0 4px 0; font-size: 14px;"><strong>마지막 위치:</strong> ${
                  person.lastLocation
                }</p>
                <p style="margin: 0 0 4px 0; font-size: 14px;"><strong>실종 시간:</strong> ${formatTime(
                  person.lastSeenTime
                )}</p>
                ${
                  person.description
                    ? `<p style="margin: 0; font-size: 14px; color: #666;"><strong>특징:</strong> ${person.description}</p>`
                    : ""
                }
                <div style="margin-top: 8px; padding: 6px; background: #fef3c7; border-radius: 4px; font-size: 12px; color: #92400e;">
                  <strong>목격 시 즉시 112 신고</strong>
                </div>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });

          newMarkers.push(marker);
        }
      });
    }

    setMarkers(newMarkers);
  }, [map, incidents, missingPersons, activeFilter, selectedLocation]);

  const clearLocationSelection = () => {
    setSelectedLocation(null);
    if (locationCircle) {
      locationCircle.setMap(null);
      setLocationCircle(null);
    }
    onLocationSelect?.(null);
  };

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="max-w-sm w-full space-y-4">
          <h3 className="text-lg font-semibold text-center">
            Google Maps API 키 입력
          </h3>
          <p className="text-sm text-gray-600 text-center">
            Google Cloud Console에서 Maps API 키를 생성하고 입력해주세요.
          </p>
          <Input
            type="text"
            placeholder="Google Maps API 키 입력"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              localStorage.setItem("google_maps_api_key", e.target.value);
            }}
            className="w-full"
          />
          <a
            href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm text-center block"
          >
            Google Maps API 키 생성하기 →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* 위치 선택 안내 */}
      {!selectedLocation && (
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
          <Navigation className="w-4 h-4 inline mr-1" />
          지도를 클릭하여 위치를 선택하세요
        </div>
      )}

      {/* 선택된 위치 정보 */}
      {selectedLocation && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-blue-600">
              📍 선택된 위치
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLocationSelection}
              className="text-gray-500 hover:text-gray-700 p-1 h-auto"
            >
              ✕
            </Button>
          </div>
          <p className="text-xs text-gray-600">반경 2km 내 사건만 표시</p>
          <p className="text-xs text-blue-600 mt-1">
            위도: {selectedLocation.lat.toFixed(4)}
            <br />
            경도: {selectedLocation.lng.toFixed(4)}
          </p>
        </div>
      )}

      {/* 범례 */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <h4 className="text-sm font-medium mb-2">범례</h4>

        {/* 위험도 */}
        <div className="mb-3">
          <h5 className="text-xs font-medium text-gray-600 mb-1">위험도</h5>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span>매우 위험</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-600"></div>
              <span>위험</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
              <span>주의</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span>안전</span>
            </div>
          </div>
        </div>

        {/* 사건 유형 */}
        <div className="mb-3">
          <h5 className="text-xs font-medium text-gray-600 mb-1">사건 유형</h5>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center gap-1">
              <span>🔪</span>
              <span>범죄</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🚗</span>
              <span>교통</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🔥</span>
              <span>화재</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🌊</span>
              <span>침수</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🚇</span>
              <span>지하철</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🌪</span>
              <span>재난</span>
            </div>
          </div>
        </div>

        {/* 위치 마커 */}
        <div>
          <h5 className="text-xs font-medium text-gray-600 mb-1">내 위치</h5>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span>🏠</span>
              <span>내 집</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏡</span>
              <span>관심 지역</span>
            </div>
            <div className="flex items-center gap-2">
              <span>❓</span>
              <span>실종자</span>
            </div>
          </div>
        </div>
      </div>

      {/* 제보 집중 지역 표시 */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <h4 className="text-sm font-medium mb-2 text-red-600">
          📍 제보 집중 지역
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span>강남역 일대</span>
            <span className="text-red-600 font-medium">47건</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>홍대입구역</span>
            <span className="text-orange-600 font-medium">23건</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>종로구 일대</span>
            <span className="text-yellow-600 font-medium">18건</span>
          </div>
        </div>
      </div>

      {/* 현재 필터 표시 */}
      {activeFilter !== "all" && (
        <div className="absolute top-16 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          <Filter className="w-4 h-4 inline mr-1" />
          {activeFilter === "crime" && "🔪 범죄"}
          {activeFilter === "traffic" && "🚗 교통"}
          {activeFilter === "fire" && "🔥 화재"}
          {activeFilter === "flood" && "🌊 침수"}
          {activeFilter === "subway" && "🚇 지하철"}
          {activeFilter === "disaster" && "🌪 재난"}
          {activeFilter === "missing" && "❓ 실종"}
          {activeFilter === "other" && "⚠️ 기타"}
        </div>
      )}
    </div>
  );
};

export default GoogleMapView;
