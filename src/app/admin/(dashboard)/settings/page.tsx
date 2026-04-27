'use client';

import { useState } from 'react';
import { MapPin, Save, Loader2, CheckCircle2, ExternalLink, Navigation, Building } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { OFFICE_LOCATION } from '@/lib/location';

export default function AdminSettingsPage() {
  const [lat, setLat] = useState(String(OFFICE_LOCATION.lat));
  const [lng, setLng] = useState(String(OFFICE_LOCATION.lng));
  const [name, setName] = useState(OFFICE_LOCATION.name);
  const [radius, setRadius] = useState(String(OFFICE_LOCATION.radiusMeters));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // TODO: Persist to Supabase settings table
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  const detectCurrentLocation = () => {
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toFixed(6));
        setLng(position.coords.longitude.toFixed(6));
        setDetectingLocation(false);
      },
      () => {
        alert('Could not detect location. Please enter coordinates manually.');
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=17`;
  const inputClasses = 'w-full px-4 py-3 rounded-lg border border-border bg-white text-navy-900 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-navy-900">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Configure office location for attendance tracking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Form */}
        <Card hover={false} className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-navy-900">Office Location</h2>
              <p className="text-xs text-text-muted">Employees must be within this radius to check in</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Office Name */}
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1.5">Office Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Primetek HQ, Hyderabad"
                className={inputClasses}
              />
            </div>

            {/* Lat / Lng */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-1.5">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="17.385044"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-1.5">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="78.486671"
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Auto-detect button */}
            <button
              type="button"
              onClick={detectCurrentLocation}
              disabled={detectingLocation}
              className="flex items-center gap-2 text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors disabled:opacity-50"
            >
              {detectingLocation ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Detecting your location...</>
              ) : (
                <><Navigation className="w-4 h-4" /> Use my current location (stand at office)</>
              )}
            </button>

            {/* Radius */}
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1.5">
                Check-in Radius (meters)
              </label>
              <input
                type="number"
                min={50}
                max={5000}
                step={50}
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className={inputClasses}
              />
              <p className="text-xs text-text-muted mt-1">
                Employees within this distance can check in. Recommended: 200–500m.
              </p>
            </div>

            {/* Save */}
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Location</>
                )}
              </Button>
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Location saved
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* How It Works + Preview */}
        <div className="space-y-6">
          {/* Map Preview */}
          <Card hover={false} className="p-6 md:p-8">
            <h2 className="font-heading font-bold text-navy-900 mb-4">Preview on Map</h2>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden border border-border hover:border-primary-300 transition-colors"
            >
              <img
                src={`https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=300&center=lonlat:${lng},${lat}&zoom=15.5&marker=lonlat:${lng},${lat};color:%230d9488;size:large&apiKey=demo`}
                alt="Office location map preview"
                className="w-full h-48 object-cover bg-surface-alt"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `<div class="w-full h-48 bg-surface-alt flex items-center justify-center text-text-muted text-sm"><span>📍 ${lat}, ${lng}</span></div>`;
                }}
              />
            </a>
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-text-secondary">
                <MapPin className="w-4 h-4 inline text-primary-500" /> {lat}, {lng}
              </p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
              >
                Open in Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </Card>

          {/* Instructions */}
          <Card hover={false} className="p-6 md:p-8">
            <h2 className="font-heading font-bold text-navy-900 mb-4">How to Set Location</h2>
            <ol className="space-y-3 text-sm text-text-secondary">
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center text-xs font-bold">1</span>
                <span><strong>Easiest:</strong> Open this page on your phone while standing at the office and click &ldquo;Use my current location&rdquo;.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center text-xs font-bold">2</span>
                <span><strong>From Google Maps:</strong> Right-click your office on <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 underline">Google Maps</a> → click the coordinates to copy them → paste Latitude and Longitude.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center text-xs font-bold">3</span>
                <span><strong>Set the radius</strong> — 500m is a good default. Smaller radius = stricter check-in.</span>
              </li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
